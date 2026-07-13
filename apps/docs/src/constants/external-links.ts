import { type PageInfo } from '@/types';

const githubProfile = 'https://github.com/nishkohli96/';
const pkgRepoLink = `${githubProfile}mui-components/blob/main/`;
const cslRepo = `${githubProfile}client-server-libs/blob/main/`;

export const validationLibLinks: Record<string, PageInfo> = {
  classValidator: {
    title: 'Class Validator',
    href: 'https://www.npmjs.com/package/class-validator'
  },
  joi: {
    title: 'Joi',
    href: 'https://www.npmjs.com/package/joi'
  },
  superstruct: {
    title: 'Superstruct',
    href: 'https://www.npmjs.com/package/superstruct'
  },
  zod: {
    title: 'Zod',
    href: 'https://www.npmjs.com/package/zod'
  },
  luxon: {
    title: 'Luxon',
    href: 'https://www.npmjs.com/package/luxon'
  }
};

export const externalLinks = Object.freeze({
  githubRepo: {
    countriesList: `${pkgRepoLink}packages/mui-components/src/mui/country-select/countries.ts`,
    rteConfig: `${pkgRepoLink}packages/mui-components/src/misc/rich-text-editor/config.ts`
  },
  githubExamples: {
    multerFileUpload: `${cslRepo}apps/express-server/src/routes/file/controller.ts`,
    fileUploadMiddleware: `${cslRepo}apps/express-server/src/middleware/file-uploader.ts`,
    ckEditorAdvanced: `${githubProfile}react-libs/blob/main/src/pages/rte/CkEditorAdvanced.tsx`,
    ckEditorCssGist: 'https://gist.github.com/nishkohli96/cc26a1b6e8e372dad1be7c5cfa42d9c5',
  },
});
