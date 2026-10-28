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

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
