# 99 COMPUTERS — Lightning Frontend Pack

Drop these three files into your existing project (replace the old ones).

## Files
- `index.html`  — better font loading + hero image preload
- `nova.css`    — performance layer + bold design upgrades
- `nova.js`     — fixed catalog caching (biggest speed win)

## What changed

### Speed
1. **Catalog no longer force-refetches** every page load  
   Old: `?v=Date.now()` + `cache: 'no-store'`  
   New: proper browser cache + 90s in-memory cache for SPA navigations
2. Reduced `backdrop-filter` blur on mobile (22px → 14px)
3. Aurora animation pauses when the tab is hidden
4. Stronger `prefers-reduced-motion` support
5. Font loading uses preload + non-blocking pattern
6. Hero image is preloaded with `fetchpriority="high"`
7. Product images now declare width/height (less layout shift)
8. Off-screen sections use `content-visibility: auto`

### Design (“crazy” layer)
- Animated gradient text on main headings
- Stronger product-card hover (lift + orange glow)
- Primary buttons get a living glow + shine sweep
- Bigger, punchier hero typography
- More dramatic stats numbers
- WhatsApp cluster card has a green gradient ring
- Active category chips glow
- Smoother reveal animations

## Image tip (extra speed)
Your product photos in `/images/shop/` are still large JPEGs (300–500 KB).  
For maximum speed, convert them to WebP and keep the original as fallback.  
You can do this later — the frontend already works without it.

## How to use
1. Back up your current `index.html`, `nova.css`, `nova.js`
2. Copy the three files from this zip into the project root
3. Deploy / hard-refresh

No backend changes required.
