<p align="center">
  <img src="https://raw.githubusercontent.com/nishkohli96/mui-components/refs/heads/main/apps/docs/public/logo.svg" width="200" />
</p>

<h1>@nish1896/mui-components</h1>

<p>
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40nish1896%2Fmui-components" />
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40nish1896%2Fmui-components" />
  <img alt="NPM Downloads Per Month" src="https://img.shields.io/npm/dm/%40nish1896%2Fmui-components?color=%23e0e063" />
  <img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/nishkohli96/mui-components" />
  <img alt="TypeScript Strict" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</p>

<p>
  <b>A suite of 25+ production-ready, form-library-agnostic <a href="https://v7.mui.com/">Material UI</a> components — fully typed, tree-shakable, and driven by a single <code>value</code> / <code>onValueChange</code> pair. Build forms with any form library (React Hook Form, TanStack Form, Formik, plain React state) or drop in each component standalone.</b>
</p>

> 📋 **Using [react-hook-form](https://react-hook-form.com/) in your application?**
>
> Skip writing the form UI logic and grab the purpose-built sibling: **[@nish1896/rhf-mui-components](https://www.npmjs.com/package/@nish1896/rhf-mui-components)** — the same Material UI components, with first-class RHF bindings baked in.

## ✨ Features

- Every component is designed to work out of the box with minimal configuration, allowing you to focus on building features instead of implementing core logic..
- **Form-library-agnostic**: every component is controlled through `value` / `onValueChange`, so it works with React Hook Form, TanStack Form, Formik, plain React state, or on its own — no adapter or wrapper required.
- Style individual components or apply global styles via [ConfigProvider](https://mui-components-docs.vercel.app/customization#configprovider).
- Includes well-configured unique components like [Rich Text Editor](https://mui-components-docs.vercel.app/components/misc/rich-text-editor), [Country Select](https://mui-components-docs.vercel.app/components/mui/country-select), [File Uploader](https://mui-components-docs.vercel.app/components/mui/file-uploader) and [Tags Input](https://mui-components-docs.vercel.app/components/mui/tags-input), saving development time.
- Provides full control over value validation and transformation before updates are committed to the state.
- Comprehensive docs showcasing multiple variations for each component.

## 📦 Installation

```bash
npm install @nish1896/mui-components @mui/material@latest-v7 @mui/x-date-pickers@latest-v8
```

`@mui/material` and `@mui/x-date-pickers` are peer dependencies.

```tsx
import { useState } from 'react';
import MUITextField from '@nish1896/mui-components/mui/textfield';

function ProfileForm() {
  const [name, setName] = useState<string>();
  return (
    <MUITextField
      fieldName="name"
      value={name}
      onValueChange={({ newValue }) => setName(newValue)}
    />
  );
}
```

## Explore and Get Started

### 📖 Documentation
Full setup instructions, API references, and examples for every component:

👉 [Documentation Website](https://mui-components-docs.vercel.app/)

### 🧪 Playground

Playground code lives on the [`v1-playground`](https://github.com/nishkohli96/mui-components/tree/v1-playground) branch. Clone repo, checkout that branch, run locally:

```bash
git clone https://github.com/nish1896/mui-components-playground.git
cd mui-components-playground
git clone git@github.com:nishkohli96/mui-components.git
cd mui-components
git checkout v1-playground
pnpm install
pnpm dev
```

## 🛠️ Local Development

This is a `pnpm` monorepo — the published package lives in `packages/mui-components`, and documentation website in `apps/docs`.

Run the setup script:

```bash
bash scripts/setup.sh
```

This will:

- Install `node_modules` in the workspace root.
- Build the `@nish1896/mui-components` package.
- Add this package as a dependency in `@nish1896/mui-components-docs` to test new and existing components.

After making changes to the package, rebuild it with:

```bash
pnpm lib
```

## 🤝 Contributing

This project has been an individual effort so far, and I'd love to invite collaborators — whether that's a new component, a doc improvement, or a bug fix. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the branch naming convention and release process, and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.

Feel free to reach out directly at [nishantkohli96@gmail.com](mailto:nishantkohli96@gmail.com).

You can also check out my [eslint config](https://www.npmjs.com/package/@nish1896/eslint-flat-config) to format and prettify your JavaScript/TypeScript code.

## License

MIT © [Nishant Kohli](https://github.com/nishkohli96)
