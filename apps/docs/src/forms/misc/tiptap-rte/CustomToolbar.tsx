'use client';

import type { Editor } from '@tiptap/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

type CustomToolbarProps = {
  editor: Editor;
  disabled: boolean;
};

/**
 * Hand-built toolbar for the "custom extensions & markdown" TipTapRte demo —
 * passed via `renderToolbar`, replacing the component's built-in one. Only
 * wires commands from extensions the demo actually loads (see
 * `reviewExtensions` in `index.tsx`): Bold/Italic/Underline plus history.
 */
export default function CustomToolbar({ editor, disabled }: CustomToolbarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 0.5 }}>
      <Button
        size="small"
        disabled={disabled}
        variant={editor.isActive('bold') ? 'contained' : 'text'}
        color="secondary"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        size="small"
        disabled={disabled}
        variant={editor.isActive('italic') ? 'contained' : 'text'}
        color="secondary"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      <Button
        size="small"
        disabled={disabled}
        variant={editor.isActive('underline') ? 'contained' : 'text'}
        color="secondary"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        Underline
      </Button>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <Button
        size="small"
        disabled={disabled || !editor.can().undo()}
        color="secondary"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon fontSize="small" />
      </Button>
      <Button
        size="small"
        disabled={disabled || !editor.can().redo()}
        color="secondary"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RedoIcon fontSize="small" />
      </Button>
    </Box>
  );
}
