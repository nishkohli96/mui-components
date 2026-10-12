<p align="center">
  <img src="https://raw.githubusercontent.com/nishkohli96/mui-components/refs/heads/version-2/apps/docs/public/logo.svg" width="200" />
</p>

<h1 align="center">@nish1896/mui-components</h1>

<p align="center">
  <b>
    A suite of 25+ production-ready, form-library-agnostic <a href="https://mui.com/">Material UI</a> components — fully typed, tree-shakable, and driven by a single <code>value</code> / <code>onValueChange</code> pair. Build forms with any form library (React Hook Form, TanStack Form, Formik, plain React state) or drop in each component standalone.
  </b>
</p>

<p>
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40nish1896%2Fmui-components" />
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40nish1896%2Fmui-components" />
  <img alt="NPM Downloads Per Month" src="https://img.shields.io/npm/dm/%40nish1896%2Fmui-components?color=%23e0e063" />
  <img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/nishkohli96/mui-components" />
  <img alt="TypeScript Strict" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="MUI v9" src="https://img.shields.io/badge/MUI-v9-007FFF?logo=mui&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</p>

<p align="center">
  <a href="https://mui-components-docs.vercel.app">Docs</a> ·
  <a href="https://www.paypal.com/paypalme/nocturnalnish">Sponsor</a>
</p>

## Why should you use this?

Material UI ships primitives, not form-ready inputs. This library, built on top of Material UI, gives you validated, styled, accessible inputs - Numeric, OTP, tags, country select, file uploader, phone etc. that work with **any** form library, with no adapters.

Each component handles its own state logic, validation, labels, and error display, and works out of the box with minimal configuration. Every component is controlled through a single `value` / `onValueChange` pair, so it works with React Hook Form, TanStack Form, Formik, plain React state, or on its own — no adapter or wrapper required. Pass props to customize the UI and behavior; skip the boilerplate.

| Feature | @nish1896/mui-components | Raw MUI |
| - | - | - |
| Works with RHF / Formik / TanStack / plain state | ✅ Pass your form state to `value` and `errorMessage`, and write changes back from `onValueChange` | manual |
| Numeric, OTP, Tags, Country & File Upload inputs built in | ✅ Same `value` / `onValueChange` / `errorMessage` contract as every other component | ❌ |
| Label, helper text & error message | ✅ Built into every component | Compose `FormControl`, `InputLabel`, `FormHelperText` yourself |
| `Select`, `Autocomplete`, `RadioGroup`, `CheckboxGroup` options | ✅ Pass an array of strings or objects (`labelKey` / `valueKey`) | Hand-write `MenuItem` / `renderOption` / mapping logic |
| Numeric values in `Select`, `RadioGroup`, `CheckboxGroup` | ✅ Return `number` values directly | Values come back as strings; convert manually |
| TypeScript | ✅ Strict, generic over option types | Partial, manual generics |

### What you get?

- Style individual components or apply global styles via [ConfigProvider](https://mui-components-docs.vercel.app/customization#configprovider), whose `sx` defaults accept an object, a theme callback or an array.
- Helpers exported from `form-helpers` module, such as [mergeSx](https://mui-components-docs.vercel.app/form-helpers/mergeSx), to merge `sx` values without losing styles, and others like [fieldNameToLabel](https://mui-components-docs.vercel.app/form-helpers/fieldNameToLabel), [validateFileList](https://mui-components-docs.vercel.app/form-helpers/validateFileList).
- Well-configured unique components like [OTP Input](https://mui-components-docs.vercel.app/components/mui/otp-input), [Country Select](https://mui-components-docs.vercel.app/components/mui/country-select), [File Uploader](https://mui-components-docs.vercel.app/components/mui/file-uploader) and [Tags Input](https://mui-components-docs.vercel.app/components/mui/tags-input), saving development time.
- Full control over value validation and transformation before updates are committed to the component state.
- Comprehensive docs showcasing multiple variations for each component.

### Why not just use MUI?

Here is the same country `Select` — options are an array of objects, with a label, a helper text and an error message — written with plain Material UI, then with this library. The `countries` array and the `useState` are identical in both, so they are left out.

```diff
- import FormControl from '@mui/material/FormControl';
- import FormHelperText from '@mui/material/FormHelperText';
- import InputLabel from '@mui/material/InputLabel';
- import MenuItem from '@mui/material/MenuItem';
- import Select from '@mui/material/Select';
+ import MUISelect from '@nish1896/mui-components/mui/select';

- <FormControl error={!!error} fullWidth>
-   <InputLabel id="country-label">Country</InputLabel>
-   <Select
-     labelId="country-label"
-     id="country"
-     label="Country"
-     value={country}
-     onChange={event => setCountry(event.target.value)}
-     aria-describedby="country-helper-text"
-   >
-     {countries.map(({ code, country }) => (
-       <MenuItem key={code} value={code}>
-         {country}
-       </MenuItem>
-     ))}
-   </Select>
-   <FormHelperText id="country-helper-text">
-     {error || 'Where do you live?'}
-   </FormHelperText>
- </FormControl>
+ <MUISelect
+   fieldName="country"
+   options={countries}
+   labelKey="country"
+   valueKey="code"
+   value={country}
+   onValueChange={({ newValue }) => setCountry(newValue)}
+   errorMessage={error}
+   helperText="Where do you live?"
+ />
```

Same UI, identical functional, but **25 lines become 11.** The label is generated from `fieldName`, the ids and `aria-*` attributes are wired for you, and the error replaces the helper text automatically. Every other component follows the same pattern, so the savings repeat for each field in a form.

> 📋 **Using [react-hook-form](https://react-hook-form.com/) in your application?**
>
> Skip writing the form UI logic and grab the purpose-built sibling: **[@nish1896/rhf-mui-components](https://www.npmjs.com/package/@nish1896/rhf-mui-components)** - the same Material UI components, with first-class RHF bindings baked in.

## ✨ Features

- Every component is designed to work out of the box with minimal configuration, allowing you to focus on building features instead of implementing core logic..
- **Form-library-agnostic**: every component is controlled through `value` / `onValueChange`, so it works with React Hook Form, TanStack Form, Formik, plain React state, or on its own — no adapter or wrapper required.
- Style individual components or apply global styles via [ConfigProvider](https://mui-components-docs.vercel.app/customization#configprovider).
- Includes well-configured unique components like [OTP Input](https://mui-components-docs.vercel.app/components/mui/otp-input), [Country Select](https://mui-components-docs.vercel.app/components/mui/country-select), [File Uploader](https://mui-components-docs.vercel.app/components/mui/file-uploader) and [Tags Input](https://mui-components-docs.vercel.app/components/mui/tags-input), saving development time.
- Provides full control over value validation and transformation before updates are committed to the component state.
- Comprehensive docs showcasing multiple variations for each component.

## 📦 Installation

```bash
npm install @nish1896/mui-components @mui/material @mui/icons-material @mui/x-date-pickers
```

`@mui/material`, `@mui/icons-material` and `@mui/x-date-pickers` are peer dependencies.

**v2 requires MUI v9** — for MUI v6/v7 support, stay on the `1.x` line.

> ⬆️ Upgrading from `1.x`? See the [v1 → v2 migration guide](https://mui-components-docs.vercel.app/migration-guide/v1-to-v2).

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

## 🚀 Explore and Get Started

### 📖 Documentation
Full setup instructions, API references, and examples for every component:

👉 [Documentation Website](https://mui-components-docs.vercel.app)

### 🧪 Playground

Playground code lives on the [`v2-playground`](https://github.com/nishkohli96/mui-components/tree/v2-playground) branch. Clone repo, checkout that branch, run locally:

```bash
git clone https://github.com/nishkohli96/mui-components.git
cd mui-components
git checkout v2-playground
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

## 🌟 Sponsors

<a href="https://www.linkedin.com/in/eramakanth/" target="_blank" title="Eramakanth">
  <img
    src="https://raw.githubusercontent.com/nishkohli96/mui-components/refs/heads/version-2/apps/docs/public/sponsors/ramakant.jpeg"
    width="40"
    height="40"
    style="border-radius: 50%;"
    alt="Ramakanth Evani"
  />
</a>

## 📄 License

MIT © [Nishant Kohli](https://nishkohli96.vercel.app/)
