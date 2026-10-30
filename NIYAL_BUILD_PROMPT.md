# Build prompt: Niyal perfume website

> Paste everything below the line into Claude Code, run from the `niyal-web` folder.
> It builds the site in phases and stops after each one so you can review before it continues.

---

You are building the website for **Niyal**, a premium perfume brand. Niyal makes high-quality fragrances shaped around the person wearing them. The brand started with one idea: *understand the customer, then create a fragrance that is uniquely theirs.* The site should feel like walking into a quiet luxury boutique. It should be calm and tactile, with nothing that looks templated.

## What the site must do

1. Show the Niyal perfume collection: a list view and a detail view for each perfume.
2. Let the user pick a bottle size for any perfume: **30 ml, 50 ml, 90 ml or 100 ml**. Each size has its own price.
3. Let the user add several items to a cart, including the same perfume in different sizes as separate lines.
4. Let the user change quantity, switch size, and remove items in the cart. All totals update immediately.
5. On **Place order**, collect the customer's details and delivery address. Then build one formatted WhatsApp message containing the customer details, address, every line item, and the totals, and open WhatsApp (`https://wa.me/<number>?text=<encoded>`) with that message prefilled.
6. Work on mobile first and stay fully responsive up to large desktops.
7. Deploy to **GitHub Pages** as a static site. There is no backend; all product data comes from a static file in the repo.

## Tech stack (do not deviate without asking)

- **Vite + React 18 + TypeScript** (strict mode, `noUncheckedIndexedAccess: true`)
- Styling: **CSS Modules + CSS custom properties** for design tokens. No Tailwind and no UI kit; every component is hand-designed.
- Animation: **`motion`** (Framer Motion) for page transitions, the cart drawer, and reveal-on-scroll. Respect `prefers-reduced-motion` everywhere.
- Routing: **`react-router-dom` with `HashRouter`** so deep links work on GitHub Pages without server rewrites.
- State: React Context + `useReducer` for the cart, persisted to `localStorage` (wrap reads and writes in try/catch and fall back to an empty cart).
- Forms: plain controlled inputs with a small hand-written validator. No form library.
- Package manager: npm.
- The repo currently contains only a bare `package.json` from `npm init`. Replace it with a proper Vite setup and keep `"name": "niyal-web"`.

## Working rules

- Build **one phase at a time**. At the end of each phase: run `npm run build` and `npx tsc --noEmit`, fix every error, give me a short summary of what was added, and **stop and wait for my go-ahead** before starting the next phase.
- Within a phase, build **element by element**: create one component, render it, then move to the next.
- Use small, single-purpose components, named exports, `type` instead of `interface`, no `any`, and no `as` casts except at a validated data boundary.
- Keep every piece of business configuration in one file, `src/config.ts`: WhatsApp number, currency, brand name, shipping rule. Nothing hard-coded elsewhere.
- Every interactive element must be keyboard accessible, show a visible focus ring, and have a hit area of at least 44×44 px.
- Never use `transition: all`. Animate only `transform` and `opacity`.

---

## Phase 0: Project scaffold

- Scaffold Vite React-TS into the current folder (not a subfolder).
- Install `react-router-dom` and `motion`.
- `vite.config.ts`: set `base: '/niyal-web/'` (put the repo name in a single constant with a comment saying to change it if the repo name changes).
- Create this folder layout:

```
src/
  app/            App.tsx, routes, providers
  components/     shared UI (Button, Price, SizeSelector, QuantityStepper, ...)
  features/
    catalog/      collection grid, product card, product detail
    cart/         cart context, reducer, drawer, cart page
    checkout/     checkout form, whatsapp message builder
  data/           perfumes.ts (static catalog)
  styles/         tokens.css, global.css, typography.css
  lib/            formatCurrency.ts, storage.ts
  config.ts
  types.ts
```

- Add the npm scripts `dev`, `build`, `preview`, `typecheck`.
- **Stop.**

## Phase 1: Design system

Pick a deliberate aesthetic direction and write it down at the top of `tokens.css` as a short comment. Starting brief (refine it, but keep the spirit):

- **Mood:** quiet luxury, warm and intimate, an atelier at dusk.
- **Palette:** a deep warm ink background for hero/feature sections (near-black with a brown undertone, not pure #000), a warm ivory/parchment surface for content, one restrained metallic accent (champagne/brass) used sparingly for prices, dividers and the primary CTA, and muted text tones. Define light-surface and dark-surface token sets. Check WCAG AA contrast for all text.
- **Typography:** an elegant high-contrast serif for display (for example *Cormorant Garamond* or *Fraunces*) paired with a refined, quiet sans for UI and body (for example *Manrope* or *Inter Tight*), loaded from Google Fonts with `display=swap`. Set up a fluid type scale with `clamp()`. Wide letter-spacing on small uppercase labels. Tabular numbers for all prices.
- **Space and shape:** an 8-px spacing scale, generous whitespace, thin 1-px hairline dividers, very small radii (bottles and cards should feel crafted, not bubbly).
- **Motion tokens:** durations (fast 160 ms, base 280 ms, slow 600 ms) and one signature easing curve.

Build and show on a temporary `/#/styleguide` route: colour swatches, type scale, `Button` (primary / ghost / text), `Price`, `Divider`, `Tag`.
**Stop.**

## Phase 2: Data model and catalog file

`src/types.ts`:

```ts
type BottleSize = 30 | 50 | 90 | 100;

type Perfume = {
  id: string;            // slug, used in the URL
  name: string;
  tagline: string;       // one evocative line
  description: string;   // 2–3 sentences
  family: 'Woody' | 'Floral' | 'Oriental' | 'Fresh' | 'Gourmand' | 'Citrus';
  notes: { top: string[]; heart: string[]; base: string[] };
  concentration: 'Eau de Parfum' | 'Extrait de Parfum' | 'Attar';
  prices: Record<BottleSize, number>;  // price per size, in rupees
  accent: string;        // hex colour used to tint this perfume's bottle art and detail page
  image?: string;        // optional path in /public/images; fall back to the generated bottle art
  featured?: boolean;
};

type CartLine = { perfumeId: string; size: BottleSize; quantity: number };
```

- `src/data/perfumes.ts`: create **8 sample perfumes** with believable names, notes and pricing (prices rise with size, and the larger bottles cost less per ml). Mark 3 as `featured`. Export `BOTTLE_SIZES` as a readonly tuple so the UI never hard-codes the list.
- `src/config.ts`:
  - `WHATSAPP_NUMBER = '91XXXXXXXXXX'` (international format, digits only, with a TODO comment)
  - `CURRENCY = 'INR'`, `LOCALE = 'en-IN'`
  - `FREE_SHIPPING_THRESHOLD` and `SHIPPING_FEE` (shipping is shown as an estimate in the message)
- `lib/formatCurrency.ts`: uses `Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 })`.
- **Stop.**

## Phase 3: Bottle art and layout shell

- **`BottleArt` component:** an elegant inline SVG perfume bottle (faceted glass body, metallic cap, subtle highlight and liquid line) tinted from the perfume's `accent`. Its proportions change slightly with the selected size, so 30 ml looks petite and 100 ml looks tall. This is the placeholder until real photography exists, so it has to look good. Use `image` instead when it is present.
- **Header:** the Niyal wordmark set in the display serif with wide tracking, nav links (Collection, Our Story, Bespoke), and a cart button with a live item-count badge that pulses briefly when the count changes. On mobile it collapses to the wordmark, a menu button and the cart; the menu opens as a full-screen overlay with staggered links.
- **Footer:** short brand line, contact via WhatsApp, Instagram placeholder, copyright.
- **Page transition wrapper:** a subtle fade/slide between routes.
- Routes: `/` (Home), `/collection`, `/perfume/:id`, `/cart`, `/checkout`, plus a 404 page.
- **Stop.**

## Phase 4: Home page (one section at a time)

1. **Hero:** dark ink background, a large serif headline built around the brand idea (a fragrance made to understand you), a short subline, and the CTAs "Explore the collection" and "Create your signature". A slow, subtle ambient effect: soft drifting light, or a gentle parallax of a featured bottle. It must not block the content and must be disabled under reduced motion.
2. **Philosophy strip:** the founding motto told in three short beats (Listen, Compose, Bottle), each with a fine-line icon.
3. **Featured perfumes:** the 3 `featured` items in a horizontal scroll-snap row on mobile and a 3-column grid on desktop.
4. **Size guide:** a visual row of the four bottles side by side (30/50/90/100 ml) with a short "which size is right for you" line under each.
5. **Bespoke CTA:** a dark section inviting customers to message Niyal on WhatsApp for a custom fragrance consultation (opens WhatsApp with a short prefilled greeting).

Reveal sections on scroll with a restrained stagger, without jumping or causing layout shift.
**Stop.**

## Phase 5: Collection page

- Filter chips by fragrance `family` (multi-select, "All" resets) and sort (Featured, Price low→high, Price high→low). Keep filter state in the URL query so it survives refresh and sharing.
- `ProductCard`: bottle art, name, tagline, family tag, and "from ₹X" (the 30 ml price). On hover (desktop) the bottle lifts slightly and a quick-add row of size pills appears. On mobile the card shows a compact "Add" button that opens a bottom sheet with the size selector.
- Responsive grid: 1 column under 480 px, 2 columns up to 900 px, 3 above, 4 on very wide screens.
- Empty state for filters that match nothing.
- **Stop.**

## Phase 6: Product detail page

- Two-column layout on desktop (sticky bottle art on the left, details on the right) that stacks on mobile.
- Name, concentration, tagline, description.
- **Notes pyramid:** top / heart / base, presented elegantly (not a plain bullet list).
- **`SizeSelector`:** four selectable bottle options showing size and price, built as a radio group with proper ARIA and arrow-key navigation. The bottle art animates to the chosen size. The selected price animates when it changes.
- **`QuantityStepper`** (minimum 1, maximum 10).
- **Add to bag** button. On click: add to the cart, show a brief confirmation (button morphs to "Added ✓"), and open the cart drawer.
- "You may also like": 3 other perfumes from the same family, or any others if the family has fewer.
- **Stop.**

## Phase 7: Cart state

- `CartProvider` with a `useReducer`, and a discriminated-union action type: `ADD`, `REMOVE`, `SET_QUANTITY`, `CHANGE_SIZE`, `CLEAR`.
  - `ADD` on an existing `perfumeId + size` line increases its quantity instead of creating a duplicate line.
  - `CHANGE_SIZE` that collides with an existing line merges the two lines.
  - Quantity is clamped to 1–10.
- Selectors computed with `useMemo`: line totals, `itemCount`, `subtotal`, `shipping`, `total`. **Prices always come from the catalog at render time and are never stored in the cart**, so a price change in `perfumes.ts` is reflected everywhere.
- Persist to `localStorage` under a versioned key (`niyal.cart.v1`). On load, drop lines whose perfume or size no longer exists.
- Write a few focused unit tests for the reducer with Vitest: add/merge, size change merge, quantity clamp, total calculation.
- **Stop.**

## Phase 8: Cart drawer and cart page

- **Cart drawer:** slides in from the right on desktop and up from the bottom on mobile. Focus is trapped while open; Esc and backdrop-click close it, and focus returns to the trigger.
- Each line: thumbnail bottle, name, size (inline editable via a compact size dropdown), quantity stepper, line total, remove button (with a 4-second "Undo" toast).
- Totals block: subtotal, shipping estimate ("Free shipping over ₹X", with a thin progress bar toward the threshold), total. Numbers animate when they change.
- Buttons: "View bag" (goes to `/cart`) and "Checkout".
- `/cart` page: same lines in a roomier layout with an order summary card that is sticky on desktop.
- Empty cart state with a link back to the collection.
- **Stop.**

## Phase 9: Checkout and WhatsApp order

**Checkout form** (`/checkout`), with an order summary alongside (collapsible on mobile):

- Full name (required)
- Phone (required, 10-digit Indian mobile validation; strip spaces and `+91`)
- Email (optional, validated if present)
- Address line 1 (required), address line 2 (optional)
- City (required), State (required, select of Indian states/UTs), PIN code (required, 6 digits)
- Order notes / fragrance preferences (optional, for example "make it less sweet" or "gift wrap"). This supports Niyal's personalised promise.

Validate on blur and on submit, with inline error messages linked through `aria-describedby`, and focus the first invalid field on submit. Remember the customer details in `localStorage` (`niyal.customer.v1`) so repeat customers don't retype them.

**`buildWhatsAppMessage(cart, customer)`** is a pure function in `features/checkout/whatsapp.ts`, with unit tests. Output format:

```
*New Order – Niyal*
Order ref: NYL-<YYMMDD>-<4 random chars>

*Customer*
Name: …
Phone: …
Email: …

*Delivery address*
…line 1
…line 2
City, State – PIN

*Order*
1. Oud Noir – 50 ml × 2 = ₹6,400
2. Rose Atelier – 30 ml × 1 = ₹1,800

Subtotal: ₹8,200
Shipping: Free
*Total: ₹8,200*

Notes: …
```

- Omit empty optional fields cleanly; never print "undefined" or blank labels.
- Encode with `encodeURIComponent` and open `https://wa.me/${WHATSAPP_NUMBER}?text=…`. Use `window.location.href` on mobile and a new tab on desktop.
- **Place order** button → a confirmation screen ("Your order is ready to send on WhatsApp. Tap send in WhatsApp to confirm.") showing the order ref, with buttons to "Open WhatsApp again" and "Clear bag & continue shopping". Do **not** clear the cart automatically, since the user may not have sent the message yet.
- If the cart is empty, `/checkout` redirects to `/collection`.
- **Stop.**

## Phase 10: Polish and quality pass

- Responsive QA at 360, 390, 768, 1024, 1440 and 1920 px widths: no horizontal scroll, comfortable thumb reach for primary actions on mobile (sticky "Add to bag" bar on the product page on mobile).
- Accessibility: semantic landmarks, alt text, `aria-live` region announcing cart updates, colour contrast check, full keyboard walkthrough from home to WhatsApp.
- Performance: lazy-load routes, `loading="lazy"` on images, preconnect to Google Fonts, Lighthouse mobile score ≥ 90 on every category.
- SEO and sharing: per-route `<title>`, meta description, Open Graph tags, favicon (a simple Niyal monogram SVG), and `theme-color`.
- Micro-interactions: press feedback (scale 0.97) on buttons, smooth hover states on cards, and the cart badge pulse. Keep it restrained; premium means fewer, better movements.
- Remove the temporary `/styleguide` route or hide it behind a dev-only flag.
- **Stop.**

## Phase 11: GitHub Pages deployment

- Add `.github/workflows/deploy.yml` using the official `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages` actions: Node 20, `npm ci`, `npm run build`, upload `dist`. Trigger on push to `main` and manually.
- Add `public/.nojekyll`.
- Write a short `README.md`: run locally, edit products in `src/data/perfumes.ts`, change the WhatsApp number in `src/config.ts`, add real photos to `public/images/` and reference them via `image`, and enable Pages in the repo settings (Source: GitHub Actions).
- Run `npm run build && npm run preview` and confirm that deep links like `/#/perfume/<id>` load correctly under the `/niyal-web/` base.
- **Done.** Give me a final summary and anything I need to fill in (WhatsApp number, real product data, photos).
