/**
 * Default extensions for the Tiptap Editor in the MUITipTapRte component.
 *
 * To view the list of complete extensions, refer
 * https://tiptap.dev/docs/editor/extensions/overview
 */
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import type { AnyExtension } from '@tiptap/core';

/**
 * Default extension set used by `MUITipTapRte` when no `editorExtensions`
 * prop is passed.
 *
 * Bundles undo/redo, headings 1-3, text styling (bold/italic/underline/
 * strikethrough), lists, blockquote, code blocks and links, with left/
 * center/right alignment on headings and paragraphs — override via the
 * component's `editorExtensions` prop to customize.
 *
 * Skipped for now (add via `editorExtensions` when needed): tables, font
 * family/color/size — `MUIRichTextEditor` (CKEditor 5) covers those already
 * if you need them today.
 */
export const DefaultEditorExtensions: AnyExtension[] = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] }
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  })
];
