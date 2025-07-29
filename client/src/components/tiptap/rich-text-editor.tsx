'use client';
import './tiptap.css';

import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
//
import { TextStyle } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, type Extension, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { TipTapFloatingMenu } from '@/components/tiptap/extensions/floating-menu';
import { FloatingToolbar } from '@/components/tiptap/extensions/floating-toolbar';
import { SearchAndReplace } from '@/components/tiptap/extensions/search-and-replace';
import { cn } from '@/lib/utils';

import { EditorToolbar } from './toolbars/editor-toolbar';

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc',
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: 'is-editor-empty',
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case 'heading': {
          return `Heading ${node.attrs.level}`;
        }
        case 'detailsSummary': {
          return 'Section title';
        }
        case 'codeBlock': {
          // never show the placeholder when editing code
          return '';
        }
        default: {
          return "Write, type '/' for commands";
        }
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  SearchAndReplace,
  Typography,
];

export function RichTextEditorDemo({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: (content: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions as Extension[],
    content: value,
    editorProps: {
      attributes: {
        class: 'max-w-full focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  if (!editor) return;

  return (
    <div
      className={cn(
        'bg-card relative max-h-[calc(100dvh-17rem)] w-full overflow-hidden overflow-y-scroll border pb-[60px] sm:pb-0',
        className,
      )}
    >
      <EditorToolbar editor={editor} />
      <FloatingToolbar editor={editor} />
      <TipTapFloatingMenu editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[300px] w-full min-w-full cursor-text sm:p-6"
      />
    </div>
  );
}
