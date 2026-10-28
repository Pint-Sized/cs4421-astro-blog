# Developer Career Showcase

An Astro site showcasing a developer's CV, portfolio, and blog, with a downloadable
PDF CV, server-side rendering, and deployment to AWS Amplify or a Docker container.

## Features

- Pages: Home, CV, Portfolio, Blog, and Contact
- Dark, responsive, accessible design (skip link, keyboard focus, reduced-motion support)
- CV web page and PDF generated from one data file
- Markdown & MDX blog with RSS feed and sitemap
- `/api/health` endpoint and request logging middleware
- ESLint, Vitest unit tests, and Playwright + axe browser/accessibility tests in CI
- Weekly Dependabot updates

## Project structure

```text
├── .github/            # CI workflow and Dependabot config
├── docs/adr/           # Architecture decision records
├── public/             # Static assets (portfolio images; cv.pdf is generated)
├── scripts/            # generate-cv-pdf.js
├── src/
│   ├── components/     # Header, Footer, BaseHead, etc.
│   ├── content/blog/   # Markdown/MDX posts
│   ├── data/cv.json    # Single source of truth for the CV
│   ├── layouts/
│   ├── pages/          # Routes, including api/health.ts and rss.xml.js
│   ├── styles/global.css
│   └── middleware.ts   # Request logging
├── tests/e2e/          # Playwright browser tests
├── amplify.yml         # AWS Amplify build spec
├── Dockerfile
└── astro.config.mjs
```

Requires Node.js `>=22.12.0`.

## Commands

All commands are run from the root of the project:

| Command                | Action                                                 |
| :--------------------- | :----------------------------------------------------- |
| `npm install`          | Install dependencies                                   |
| `npm run dev`          | Generate the CV PDF and start dev server at `:4321`    |
| `npm run build`        | Generate the CV PDF and build the production site      |
| `npm run preview`      | Preview the production build locally                   |
| `npm run generate:cv`  | Regenerate `public/cv.pdf` from `src/data/cv.json`     |
| `npm run lint`         | Run ESLint                                             |
| `npm run check`        | Run Astro type checks                                  |
| `npm run test:unit`    | Run Vitest unit tests                                  |
| `npm run test:e2e`     | Build, then run Playwright browser/accessibility tests |

## Testing

- Unit tests (`src/**/*.test.ts`) run with Vitest, including a check that the
  PDF contains every CV field as selectable text.
- Browser tests (`tests/e2e`) run with Playwright against a production preview on
  port 4322, at mobile (390px) and desktop (1440px) viewports, with axe
  accessibility checks. First run `npx playwright install chromium`. If the
  downloaded browser lacks system libraries (e.g. on NixOS), set
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a system Chromium.
- GitHub Actions runs lint, check, unit tests, and browser tests on every pull
  request and push to `main`; failures block the workflow.

## CV PDF

The web CV and downloadable PDF are generated from the same source file:
`src/data/cv.json`. Update that file to change CV content. Run
`npm run generate:cv` to regenerate `public/cv.pdf`; `npm run build` runs this
generator automatically before building the site, so deployed PDFs cannot be
left stale relative to the web CV. The PDF is a generated file and is
git-ignored, so it is not committed.

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

## SSR and container deployment

Astro uses the official standalone Node adapter by default, which is used by
the Docker build. Amplify builds explicitly set `ASTRO_ADAPTER=amplify` to use
the community `astro-aws-amplify` adapter.

Build and run the Docker image locally:

```sh
docker build --platform linux/amd64 -t astro-blog:v1.0.0 .
docker run -d -p 4321:4321 --name my-blog -e NODE_ENV=production astro-blog:v1.0.0
```

Verify the API and container health:

```sh
curl -i http://localhost:4321/api/health
docker ps
docker inspect --format='{{json .State.Health}}' my-blog
```

The API should return HTTP 200 and JSON with `status`, `uptime`, and `timestamp`.
View request logs with `docker logs -f my-blog`; stop the test container with
`docker rm -f my-blog`.

To publish to ECR, create a private repository named `astro-blog` in your AWS
region, authenticate Docker with AWS CLI credentials, then tag and push the
image using that repository's URI. If you have not created the registry yet,
create it in **AWS Console → ECR → Private repositories → Create repository**.

```sh
aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com
docker tag astro-blog:v1.0.0 ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/astro-blog:v1.0.0
docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/astro-blog:v1.0.0
```

See [ADR-001](docs/adr/ADR-001-transition-to-ssr-and-containers.md) for the
architecture decision.

## Learn more

See the [Astro documentation](https://docs.astro.build).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
