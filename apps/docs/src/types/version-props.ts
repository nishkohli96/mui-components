export type DocsVersion = 1 | 2;
export type MuiVersion = 6 | 7;
export type MuiXVersion = 7 | 8;

export type VersionProps = {
  docsVersion?: DocsVersion;
  muiVersion?: MuiVersion;
  muiXVersion?: MuiXVersion;
};

/**
 * Version args threaded through `constants/props-table` when a prop's
 * description/type links to versioned MUI (or MUI X) docs — pin these once
 * per release (e.g. `{ muiVersion: 7, muiPickersVersion: 8 }`) so a future
 * version bump (v2 / MUI 9) only means updating the values passed in.
 */
export type PropsDescriptionArgs = {
  muiVersion?: MuiVersion;
  muiPickersVersion?: MuiXVersion;
};
