'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CheckIcon from '@mui/icons-material/Check';

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
      <Box sx={{ position: 'relative', display: 'flex' }}>
        {copied
          ? <ContentPasteIcon fontSize="inherit" />
          : <ContentCopyIcon fontSize="inherit" />
        }
        {copied && (
          <CheckIcon
            fontSize="inherit"
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              fontSize: 10,
              bgcolor: 'background.paper',
              color: 'success.main',
              borderRadius: '50%',
              boxShadow: 1
            }}
          />
        )}
      </Box>
    </IconButton>
  );
};

export default CopyInstallCommand;
