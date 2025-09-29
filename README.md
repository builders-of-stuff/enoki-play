# Notes

Video walkthrough:
https://youtu.be/YwRQnTOks4s

If you'd like to try it out:

1. Setup your Enoki API keys and Google oAuth
2. create and fill .env file as per .env.example
3. Deploy move contracts on testnet or wherever
4. Update the contract IDs in the constants file

pnpm install
pnpm run dev

---

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
