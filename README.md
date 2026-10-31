# Niyal

The website for Niyal, a perfume brand. Customers browse the collection, fill a bag and send their order on WhatsApp. There is no backend, so everything lives in this repo.

## Run it locally

You need Node 20.19 or newer. The `.nvmrc` file picks the right major version for nvm.

```bash
nvm use
npm install
npm run dev
```

Vite prints the address, which ends in `/niyal/`.

| Command | What it does |
| --- | --- |
| `npm test` | Runs the unit tests |
| `npm run build` | Typechecks and builds into `dist` |
| `npm run preview` | Serves that build, as a last check before deploying |

While `npm run dev` is running, `/#/styleguide` shows the colours, type and components. It isn't included in the built site.

## Change the business details

Everything is in `src/config.ts`:

- `WHATSAPP_NUMBER`: where orders go. International format, digits only, like `919876543210`.
- `INSTAGRAM_URL`: the link in the footer.
- `FREE_SHIPPING_THRESHOLD` and `SHIPPING_FEE`: in rupees.
- `SITE_URL`: the published address, used by share previews.

## Edit the products

Products are in `src/data/perfumes.ts`, one entry per perfume.

- `prices` needs a price in rupees for all four sizes.
- `accent` is a hex colour that tints the bottle and the product page.
- `featured: true` puts a perfume on the home page. The first three count, the first one is the hero bottle, and the second appears in the size guide.
- `id` becomes the page address, so changing it breaks old links and removes that perfume from any bag already saved in a customer's browser.

Prices are read from this file every time, so a change here applies to bags people have already started.

## Add real photos

Put the file in `public/images/`, then point the perfume at it:

```ts
image: 'images/oud-noir.jpg',
```

The photo replaces the drawn bottle everywhere. Portrait images at a 2:3 ratio fit best. One photo serves all four sizes, so the bottle no longer changes size when a customer picks one.

The image shown when someone shares a link is `public/og-image.png`, at 1200 × 630. It currently shows a sample perfume, so replace it once real products are in.

## Deploy

Every push to `main` builds and deploys through `.github/workflows/deploy.yml`. You can also start it by hand from the Actions tab.

One setting has to be right first: in the repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**.

If the repo is ever renamed, update `REPO_NAME` in `vite.config.ts` and `SITE_URL` in `src/config.ts`. Otherwise the site loads as a blank page, because it looks for its files under the old name.
