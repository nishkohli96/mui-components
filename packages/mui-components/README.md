<p align="center">
  <img src="https://raw.githubusercontent.com/nishkohli96/mui-components/refs/heads/version-2/apps/docs/public/logo.svg" width="200" />
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
> Skip writing the form UI logic and grab the purpose-built sibling: **[@nish1896/rhf-mui-components](https://www.npmjs.com/package/@nish1896/rhf-mui-components)** - the same Material UI components, with first-class RHF bindings baked in.

## ✨ Features

- Every component is designed to work out of the box with minimal configuration, allowing you to focus on building features instead of implementing core logic..
- **Form-library-agnostic**: every component is controlled through `value` / `onValueChange`, so it works with React Hook Form, TanStack Form, Formik, plain React state, or on its own — no adapter or wrapper required.
- Style individual components or apply global styles via [ConfigProvider](https://mui-components-docs.vercel.app/customization#configprovider).
- Includes well-configured unique components like [OTP Input](https://mui-components-docs.vercel.app/components/mui/otp-input), [Country Select](https://mui-components-docs.vercel.app/components/mui/country-select), [File Uploader](https://mui-components-docs.vercel.app/components/mui/file-uploader) and [Tags Input](https://mui-components-docs.vercel.app/components/mui/tags-input), saving development time.
- Provides full control over value validation and transformation before updates are committed to the component state.
- Comprehensive docs showcasing multiple variations for each component.

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

## Components List

Below is a comprehensive list of all components included in this package, categorized by module.

Each is imported from its own subpath (e.g. `@nish1896/mui-components/mui/textfield`) for optimal tree-shaking.

- **mui**
  - [TextField](https://mui-components-docs.vercel.app/components/mui/textfield)
  - [Password Input](https://mui-components-docs.vercel.app/components/mui/password-input)
  - [Number Input](https://mui-components-docs.vercel.app/components/mui/number-input)
  - [OTP Input](https://mui-components-docs.vercel.app/components/mui/otp-input)
  - [Tags Input](https://mui-components-docs.vercel.app/components/mui/tags-input)
  - [File Uploader](https://mui-components-docs.vercel.app/components/mui/file-uploader)
  - [Select](https://mui-components-docs.vercel.app/components/mui/select)
  - [Native Select](https://mui-components-docs.vercel.app/components/mui/native-select)
  - [Autocomplete](https://mui-components-docs.vercel.app/components/mui/autocomplete)
  - [Autocomplete Object](https://mui-components-docs.vercel.app/components/mui/autocomplete-object)
  - [Multi Autocomplete](https://mui-components-docs.vercel.app/components/mui/multi-autocomplete)
  - [Multi Autocomplete Object](https://mui-components-docs.vercel.app/components/mui/multi-autocomplete-object)
  - [Country Select](https://mui-components-docs.vercel.app/components/mui/country-select)
  - [Checkbox](https://mui-components-docs.vercel.app/components/mui/checkbox)
  - [Checkbox Group](https://mui-components-docs.vercel.app/components/mui/checkbox-group)
  - [Radio Group](https://mui-components-docs.vercel.app/components/mui/radio-group)
  - [Slider](https://mui-components-docs.vercel.app/components/mui/slider)
  - [Switch](https://mui-components-docs.vercel.app/components/mui/switch)
  - [Rating](https://mui-components-docs.vercel.app/components/mui/rating)

- **mui-pickers**
  - [Date](https://mui-components-docs.vercel.app/components/mui-pickers/date)
  - [Time](https://mui-components-docs.vercel.app/components/mui-pickers/time)
  - [DateTime](https://mui-components-docs.vercel.app/components/mui-pickers/date-time)
- **misc**
  - [Color Picker](https://mui-components-docs.vercel.app/components/misc/color-picker)
  - [Rich Text Editor](https://mui-components-docs.vercel.app/components/misc/rich-text-editor)
  - [Phone Input](https://mui-components-docs.vercel.app/components/misc/phone-input)

**This project has been an individual effort so far, and I’d love to invite collaborators to contribute by adding new components or improving the documentation and examples for existing ones. If you're interested, feel free to reach out at [nishantkohli96@gmail.com](mailto:nishantkohli96@gmail.com).**

You can also check out my [eslint config](https://www.npmjs.com/package/@nish1896/eslint-flat-config), to format and prettify your javascript code.
