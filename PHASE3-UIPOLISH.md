# Jornal Tatu — Phase 3: UI Polish & Mobile Responsive

**Status**: In Progress (2026-03-02 09:45 PT)  
**Objective**: Ensure beautiful design + mobile perfection before deploy

## Checklist

### Design Refinements
- [ ] **Typography hierarchy** — Ensure 18px title / 14px excerpt / 12px meta on all screens
- [ ] **Spacing consistency** — Check all card padding (16px) and gaps (24px)
- [ ] **Color contrast** — Verify WCAG AA (4.5:1 minimum for text)
- [ ] **Hover states** — Card lift, color change, smooth transition
- [ ] **Focus states** — Tab navigation highlights properly
- [ ] **Loading skeleton** — Animation smooth, visual polish

### Mobile Testing (test on actual device if possible)
- [ ] **iPhone 12 / 14** — Test all 5 categories, scroll, click links
- [ ] **Android device** — Same tests
- [ ] **Portrait orientation** — Single column, full width, proper padding
- [ ] **Landscape orientation** — 2 columns if space available
- [ ] **Touch targets** — Minimum 48px tap size for buttons/links
- [ ] **Font sizes** — Readable without zoom (16px minimum body)

### Performance
- [ ] **Network tab** — JavaScript executes, API calls succeed
- [ ] **No console errors** — Check browser DevTools console
- [ ] **API response time** — Should be <500ms per category
- [ ] **First load** — Skeletons appear immediately, then content

### Accessibility
- [ ] **Keyboard nav** — Tab through tabs + links works
- [ ] **Screen reader** — Test with VoiceOver (Mac) or NVDA (Win)
- [ ] **Color blind** — No color-only indicators (accent colors not sole indicator)
- [ ] **Alt text** — News source + timestamp are readable by screen readers

### Cross-Browser
- [ ] **Chrome** — Latest version
- [ ] **Firefox** — Latest version
- [ ] **Safari** — Latest version
- [ ] **Edge** — Latest version (if testing on Windows)

### Polish Details
- [ ] **Search box removal** — (optional) Keep or remove?
- [ ] **Newsletter signup** — (optional) Keep or remove?
- [ ] **Footer links** — Update or remove dead links
- [ ] **Meta tags** — Update description for SEO
- [ ] **Favicon** — Add 🐢 emoji as favicon

## QA Scripts

### Browser Console Test
```javascript
// Paste this in browser DevTools console to validate rendering
const cards = document.querySelectorAll('.news-card');
console.log(`✓ Cards rendered: ${cards.length}`);
const links = document.querySelectorAll('.news-card-link');
console.log(`✓ Links present: ${links.length}`);
console.log('✓ Check console.log output above for errors');
```

### Mobile Simulator (Chrome DevTools)
1. Open DevTools (F12)
2. Click device icon (top-left of DevTools)
3. Select "iPhone 12" or "Pixel 5"
4. Test all tabs, scroll, links

## Known Issues to Fix
- [ ] (Add any issues found during testing)

## Sign-Off
- [ ] UI polish complete
- [ ] Mobile tested
- [ ] No console errors
- [ ] Ready for Phase 4 Deploy

**Next Step**: Phase 4 — Deploy to Vercel + GitHub Pages
