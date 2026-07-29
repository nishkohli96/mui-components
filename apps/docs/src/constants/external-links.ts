const githubProfile = 'https://github.com/nishkohli96/';
const pkgRepoLink = `${githubProfile}mui-components/blob/main/`;
const cslRepo = `${githubProfile}client-server-libs/blob/main/`;

export const githubRepoLink = 'https://github.com/nishkohli96/mui-components';
export const npmLink = 'https://www.npmjs.com/package/@nish1896/mui-components';

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
