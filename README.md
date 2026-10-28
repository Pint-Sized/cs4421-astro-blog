# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build the production site and SSR bundle         |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deploying to AWS

This project uses AWS Amplify Hosting with the `astro-aws-amplify` adapter for
server-side rendering. The `amplify.yml` build specification packages
`.amplify-hosting/` for Amplify's SSR compute. Amplify builds and deploys
connected-branch changes; no CDK bootstrap or AWS credentials in GitHub Actions
are needed.

To deploy:

1. In the AWS Console, open **AWS Amplify** and choose **Create new app**.
2. Connect GitHub, authorize Amplify, and select this repository and the `main`
   branch. Use the repository's `amplify.yml` build settings.
3. In **Advanced settings**, set the environment variable
   `_CUSTOM_IMAGE` to `amplify:al2023`, enable SSR app logs, and choose or create
   an Amplify service role. The adapter requires the Amazon Linux 2023 runtime.
4. Open the deployed app in Amplify to find its HTTPS URL.
5. In the Amplify app's build settings, set the `SITE_URL` environment variable
   to that URL, then redeploy so the generated sitemap uses the correct domain.

For the rollback drill, merge a deliberately broken change to the connected
branch through a PR, verify the live result, then merge a revert PR and confirm
Amplify redeploys the restored version.

## Dynamic SSR locally

Astro is configured for server rendering with the community
`astro-aws-amplify` adapter. Run the development server locally with:

```sh
npm run dev -- --host 0.0.0.0
```

In another terminal, check the dynamic health endpoint:

```sh
curl -i http://localhost:4321/api/health
```

It should return HTTP 200 and JSON with `status`, `uptime`, and `timestamp`.
Each request also emits a structured JSON log line in the server terminal.
See [ADR-001](docs/adr/ADR-001-transition-to-ssr-and-containers.md) for the
architecture decision.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
