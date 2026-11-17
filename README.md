# 99 COMPUTERS — Fast + Premium Frontend

Replace these 3 files in your project root.

## Files
- `index.html` — faster font + hero preload
- `nova.css` — performance + stronger design (dark & light)
- `nova.js` — catalog caching fix (biggest speed win)

## Speed fixes kept
- Catalog no longer force-refetches every navigation
- Reduced blur on mobile
- Aurora pauses when tab is hidden
- content-visibility on off-screen pages
- Better font loading
- Image width/height to reduce layout shift

## Design fixes (this revision)
- Light theme is no longer washed-out / pastel
- Brand title stays solid and readable (no broken gradient)
- Only the accent words (e.g. “category”) use the orange accent
- Product & category cards have stronger hover lift
- Missing category images no longer show as empty blue boxes
- Primary buttons keep a clean glow without looking noisy
- Stats and chips refined for both themes

## Install
1. Backup current index.html, nova.css, nova.js
2. Copy the 3 files from this zip into the project root
3. Hard-refresh the site

Works with both Flask and Node backends. No backend changes needed.
