# @nish1896/mui-components-docs

**The documentation and live-examples site for [`@nish1896/mui-components`](https://www.npmjs.com/package/@nish1896/mui-components) — built with Next.js.** 📖

It hosts the setup guides, full props reference, and interactive demos for every component, including complete-form examples wired up with React Hook Form, TanStack Form, Formik and plain React state.

### Documentation

Setup guides, API references, and multiple live variations for every component:

👉 [Documentation Site](https://mui-components-docs.vercel.app)

### 🧪 Playground

Playground code lives on the [`v2-playground`](https://github.com/nishkohli96/mui-components/tree/v2-playground) branch. Clone repo, checkout that branch, run locally:

```bash
git clone https://github.com/nishkohli96/mui-components.git
cd mui-components
git checkout v2-playground
pnpm install
pnpm dev
```

### Local Development

From the monorepo root:

```bash
pnpm doc
```

This starts the docs app on [http://localhost:3000](http://localhost:3000). It consumes the built `@nish1896/mui-components` package, so after changing the library, rebuild it with `pnpm lib`.
