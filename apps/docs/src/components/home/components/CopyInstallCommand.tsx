'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { CopyCodeIcon } from '@/components/buttons';

type CopyInstallCommandProps = {
  command: string;
};

const CopyInstallCommand = ({ command }: CopyInstallCommandProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <IconButton
      size="small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(command);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* Clipboard unavailable (unfocused tab / permissions) — ignore. */
        }
      }}
      sx={{
        mx: 1,
        p: 1,
        color: 'text.secondary'
      }}
    >
      <CopyCodeIcon isCopied={copied} />
    </IconButton>
  );
};

export default CopyInstallCommand;
