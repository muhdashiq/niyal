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
- `FREE_SHIPPING_THRESHOLD` and `SHIPPING_FEE`: in rupees, for orders to India only.
- `CURRENCIES`: the exchange rates. They're fixed, not live, so update `rupeesPerUnit` when you want prices to move. Converted prices round up to the nearest `roundTo`.
- `SITE_URL`: the published address, used by share previews.

## Languages, currencies and shipping

The site is in English, Arabic, Malayalam, Hindi, Tamil, Kannada, Urdu, Spanish, Japanese and Simplified Chinese. Prices show in INR, USD, AED, SAR, OMR, BHD, KWD, QAR, EUR or GBP. The globe in the header changes the language, the currency and the delivery country. A first visit guesses them from the browser's language and time zone.

Each language has a file in `src/i18n/messages/`. `npm run build` fails if one is missing a sentence, so to change a line of text, change it in `en.ts` and then in the nine others.

Perfume copy works differently, so adding a product can't break a page. The English lives in `src/data/perfumes.ts`, and the `perfumes` and `notes` at the bottom of each language file hold the translations. Anything missing there shows in English. If you change a description in `perfumes.ts`, the old translations stay until you change those too. Perfume names are never translated, because they're printed on the bottle.

Orders to India use `SHIPPING_FEE` and `FREE_SHIPPING_THRESHOLD`. Orders anywhere else show "International courier charges apply", leave the charge out of the total, and you agree it on WhatsApp. The WhatsApp order message is always in English so you can read every order, and it tells you the language the customer used.

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
