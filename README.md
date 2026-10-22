# 99 COMPUTERS website

Static website and product catalogue with Vercel serverless endpoints for secure staff sign-in and publishing.

## Deploying the security updates

1. Import/push this project to the intended GitHub repository and deploy it with Vercel.
2. In Vercel → Project → Settings → Environment Variables, add:
   - `GITHUB_TOKEN`: a GitHub token scoped to the `keithkirujah/99computers` repository with only the Contents read/write permission needed to publish catalogue/images/activity log.
   - `SESSION_SECRET`: a newly generated random secret of at least 32 characters. Generate one locally with `openssl rand -base64 48` or a password manager. Never commit it.
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD`: a unique administrator username and a long, unique password.
   - Optional additional accounts: `SITE_USERNAME` + `SITE_PASSWORD`, and/or `STAFF_USERNAME` + `STAFF_PASSWORD`.
3. Redeploy after adding environment variables. The admin console is at `/admin.html`.
4. Do not reuse the old demo credentials (`99admin/admin123`, `99owner/owner123`, `99staff/staff123`). They have been removed from the client code. Configure new credentials in Vercel.
5. Confirm HTTPS is active before signing in. Session cookies are `Secure`, `HttpOnly`, and `SameSite=Strict`.
6. Test sign-in, product creation/editing/deletion, image upload, sign-out, and direct product URLs in a private browser window.

## Security model

- Authentication is verified by `/api/auth` and uses an HMAC-signed, eight-hour session cookie.
- `/api/save` rejects requests without a valid session, checks same-origin requests, restricts writes to `catalog.json` and approved product-image filenames, limits payload sizes, and validates catalogue JSON before publishing.
- Activity logging is performed by the server after catalogue writes; the browser no longer writes arbitrary activity-log content.
- The GitHub token is only read by the serverless function and must never be put in JavaScript or HTML.
- Vercel headers add HSTS, CSP, anti-framing, MIME sniffing, referrer, and permissions policies.
- The staff login screen intentionally does not support changing passwords in the browser. Rotate credentials in Vercel environment variables and redeploy.

## Important deployment notes

- The project uses a fixed GitHub owner/repository/branch in `api/save.js`. If you deploy to a different repository, update `OWNER`, `REPO`, and `BRANCH` there before deployment.
- The app's catalogue is currently read from the public GitHub repository, so published catalogue contents remain public. Do not put customer records, credentials, private purchase data, or other secrets in `catalog.json` or public backups.
- The in-memory login delay is only best-effort rate friction on serverless platforms. Use Vercel Firewall/rate limiting or an identity provider for stronger brute-force protection.
- Before production use, review the GitHub token permissions and audit repository history for secrets. If a real token was previously exposed, revoke and replace it.
- Security headers should be verified on the deployed domain. The CSP allows inline scripts/styles to preserve the existing design; moving inline code to files and adopting a nonce/hash-based CSP would strengthen it further.

## Product routes

Vercel rewrites `/shop/p/:id` to `index.html`, allowing the existing frontend router to render the product modal on direct loads and refreshes.
