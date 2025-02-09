This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
This project uses bun for package management. Other package managers may not be supported.

### Install dependencies
```bash
bun install
```

### Apply database migrations
> Do ensure you have your .env file setup with a DATABASE_URL
```shell
bun drizzle-kit generate
bun drizzle-kit migrate
```

### Run development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Developing
Install the hooks which will run prettier on commit.
```bash
lefthook install
```

## File structure
### Root Directory
- `app/` - Core directory for routes, layouts, and pages.
- `components` - Components reused frequently in the app pages.
- `db` - drizzle configuration and schema definition.
- `drizzle` - drizzle related configurations and migrations.
- `lib` - additional useful utilities.
- `providers` - react context providers used in the app.
- `public/` - Static assets (e.g., images, fonts).
- `node_modules/` - Installed dependencies.
- `package.json` - Project metadata and dependencies.
- `next.config.js` - Next.js configuration.
- `tsconfig.json` - TypeScript configuration.
- `.env` - Environment variables.
- `middleware.js` - Global request handling.

### `app/` Directory
- `layout.js` - Root layout for the app.
- `page.js` - Homepage (`/` route).
- `loading.js` - Loading UI for the route.
- `error.js` - Error boundary for the route.
- `not-found.js` - Custom 404 page.
- `template.js` - Re-renders on navigation.
- `route.js` - API routes or server-side logic.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
