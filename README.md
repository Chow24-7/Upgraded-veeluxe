# Veeluxe

Veeluxe is a skincare store built with Next.js 16 App Router, JavaScript, Tailwind CSS v4, and Paystack. Orders are verified on the server and stored in Firestore.

## Run locally

Use Node.js 20.9 or newer. Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open http://localhost:3000. The project keeps `legacy-peer-deps=true` in `.npmrc` and uses `next build --webpack` for production builds.

## Environment variables

Add the following to `.env.local` for local work and to the matching environment in Vercel:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production required | Public origin used for metadata, canonical URLs, sitemap, and robots. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_PAYSTACK_KEY` | Checkout required | Paystack public key used by the browser checkout. |
| `PAYSTACK_SECRET_KEY` | Payment processing required | Server-only key used to verify Paystack references and webhook signatures. |
| `FIREBASE_PROJECT_ID` | Orders and admin required | Firebase project ID for Firestore. |
| `FIREBASE_CLIENT_EMAIL` | Orders and admin required | Service account client email. |
| `FIREBASE_PRIVATE_KEY` | Orders and admin required | Service account private key. Store it as a secret. In Vercel, preserve escaped newlines as `\\n` if needed. |
| `ADMIN_PASSWORD` | Admin required | Password for `/admin/orders`. Use a long, unique secret. |
| `SMTP_HOST` | Email required | SMTP server hostname. |
| `SMTP_PORT` | Email required | SMTP port, commonly `587` or `465`. |
| `SMTP_USER` | Email required | SMTP account username. |
| `SMTP_PASS` | Email required | SMTP account password. Store it as a secret. |
| `SMTP_FROM` | Optional | Sender address. Defaults to `SMTP_USER`. |
| `CONTACT_EMAIL` | Optional | Business inbox for contact and order notifications. Defaults to `SMTP_USER`. |

Never commit `.env.local`, service account credentials, or live payment secrets. Configure Paystack's webhook URL as `https://your-domain/api/paystack/webhook`.

## Products and prices

Edit `src/data/products.js`. Each product has an integer `id`, name, base price in NGN, image path under `public/images`, and description. For products with options, add a `sizes` array of `{ label, price }` entries. Use the same labels and prices for product display and server-side checkout verification. Product detail pages and the sitemap are generated from this data.

## Blog posts

Add a Markdown file under `content/blog`. Include frontmatter with `title`, `date` in `YYYY-MM-DD` format, `excerpt`, `slug`, and an `image` path under `public/images`, followed by the post body. Use Markdown-style internal links such as `[Luxe Body Butter](/products/3)` and `[related article](/blog/article-slug)` for links within article copy.

## Build and deploy

Run the production checks:

```sh
npm run lint
npx next build --webpack
```

In Vercel, import the repository, set the environment variables above, and deploy using the existing build script. Add the Paystack webhook URL in the Paystack dashboard. Use Paystack test keys and test transactions before switching to live keys. Confirm the Firestore service account has only the required Firestore access.
