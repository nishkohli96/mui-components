import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

type ToolbarButton = {
  label: string;
  icon: ReactNode;
  /** Name of the Tiptap extension this button's command depends on — the
   * button is omitted entirely when that extension isn't loaded, since
   * calling a command whose extension is missing throws at runtime. */
  extension: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

type ToolbarProps = {
  editor: Editor;
  disabled?: boolean;
};

/**
 * A minimal formatting toolbar for `MUITipTapRte` — Tiptap ships headless
 * (no built-in UI), so unlike CKEditor 5 this toolbar is hand-built from the
 * editor's own command chain (`editor.chain().focus()...run()`) and active
 * state (`editor.isActive(...)`).
 *
 * `editorExtensions` lets callers replace the default extension set, so
 * every button is gated on its backing extension actually being loaded
 * (`hasExtension`) — a custom set missing e.g. `Heading` or `TextAlign`
 * simply omits those buttons instead of throwing when clicked.
 */
const Toolbar = ({ editor, disabled }: ToolbarProps) => {
  const hasExtension = (name: string) =>
    editor.extensionManager.extensions.some(extension => extension.name === name);

  const headingButtons: ToolbarButton[] = [1, 2, 3].map(level => ({
    label: `Heading ${level}`,
    icon: <span style={{ fontSize: 13, fontWeight: 600 }}>
      {`H${level}`}
    </span>,
    extension: 'heading',
    isActive: editor.isActive('heading', { level }),
    onClick: () => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
  }));

  const markButtons: ToolbarButton[] = [
    {
      label: 'Bold',
      icon: <FormatBoldIcon fontSize="small" />,
      extension: 'bold',
      isActive: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run()
    },
    {
      label: 'Italic',
      icon: <FormatItalicIcon fontSize="small" />,
      extension: 'italic',
      isActive: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run()
    },
    {
      label: 'Underline',
      icon: <FormatUnderlinedIcon fontSize="small" />,
      extension: 'underline',
      isActive: editor.isActive('underline'),
      onClick: () => editor.chain().focus().toggleUnderline().run()
    },
    {
      label: 'Strikethrough',
      icon: <StrikethroughSIcon fontSize="small" />,
      extension: 'strike',
      isActive: editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run()
    }
  ];

  const listButtons: ToolbarButton[] = [
    {
      label: 'Bulleted list',
      icon: <FormatListBulletedIcon fontSize="small" />,
      extension: 'bulletList',
      isActive: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run()
    },
    {
      label: 'Numbered list',
      icon: <FormatListNumberedIcon fontSize="small" />,
      extension: 'orderedList',
      isActive: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run()
    },
    {
      label: 'Blockquote',
      icon: <FormatQuoteIcon fontSize="small" />,
      extension: 'blockquote',
      isActive: editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run()
    },
    {
      label: 'Code block',
      icon: <CodeIcon fontSize="small" />,
      extension: 'codeBlock',
      isActive: editor.isActive('codeBlock'),
      onClick: () => editor.chain().focus().toggleCodeBlock().run()
    }
  ];

  const alignButtons: ToolbarButton[] = [
    {
      label: 'Align left',
      icon: <FormatAlignLeftIcon fontSize="small" />,
      extension: 'textAlign',
      isActive: editor.isActive({ textAlign: 'left' }),
      onClick: () => editor.chain().focus().setTextAlign('left').run()
    },
    {
      label: 'Align center',
      icon: <FormatAlignCenterIcon fontSize="small" />,
      extension: 'textAlign',
      isActive: editor.isActive({ textAlign: 'center' }),
      onClick: () => editor.chain().focus().setTextAlign('center').run()
    },
    {
      label: 'Align right',
      icon: <FormatAlignRightIcon fontSize="small" />,
      extension: 'textAlign',
      isActive: editor.isActive({ textAlign: 'right' }),
      onClick: () => editor.chain().focus().setTextAlign('right').run()
    }
  ];

  const linkButtons: ToolbarButton[] = [
    {
      label: 'Link',
      icon: <LinkIcon fontSize="small" />,
      extension: 'link',
      isActive: editor.isActive('link'),
      onClick: () => {
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        // eslint-disable-next-line no-alert
        const url = window.prompt('URL', previousUrl ?? 'https://');
        if (url === null) {
          return;
        }
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    },
    {
      label: 'Remove link',
      icon: <LinkOffIcon fontSize="small" />,
      extension: 'link',
      disabled: !editor.isActive('link'),
      onClick: () => editor.chain().focus().unsetLink().run()
    }
  ];

  const historyButtons: ToolbarButton[] = [
    {
      label: 'Undo',
      icon: <UndoIcon fontSize="small" />,
      extension: 'history',
      disabled: !editor.can().undo(),
      onClick: () => editor.chain().focus().undo().run()
    },
    {
      label: 'Redo',
      icon: <RedoIcon fontSize="small" />,
      extension: 'history',
      disabled: !editor.can().redo(),
      onClick: () => editor.chain().focus().redo().run()
    }
  ];

  const groups = [
    historyButtons,
    headingButtons,
    markButtons,
    listButtons,
    alignButtons,
    linkButtons
  ]
    .map(group => group.filter(button => hasExtension(button.extension)))
    .filter(group => group.length > 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.5,
        p: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      {groups.map((group, groupIndex) => (
        <Box key={group[0].extension} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          {groupIndex > 0 && (
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
          )}
          {group.map(button => (
            <IconButton
              key={button.label}
              type="button"
              size="small"
              aria-label={button.label}
              title={button.label}
              disabled={disabled || button.disabled}
              color={button.isActive ? 'primary' : 'default'}
              onMouseDown={event => event.preventDefault()}
              onClick={button.onClick}
            >
              {button.icon}
            </IconButton>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default Toolbar;
