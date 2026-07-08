'use client';

import { useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

type CopyButtonProps = {
  /** Text placed on the clipboard when clicked. */
  text: string;
};

/**
 * Small clipboard button used inside code blocks. The only interactive
 * (client) part of a code block — the highlighted code itself is
 * rendered on the server.
 */
const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard unavailable (permissions/insecure context) — ignore. */
    }
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy code'} placement="left">
      <IconButton
        size="small"
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        sx={{ color: 'inherit', opacity: 0.7, '&:hover': { opacity: 1 } }}
      >
        {copied
          ? <CheckIcon fontSize="inherit" color="success" />
          : <ContentCopyIcon fontSize="inherit" />}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
