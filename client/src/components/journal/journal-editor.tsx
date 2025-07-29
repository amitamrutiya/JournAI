'use client';
import { Textarea } from '@/components/ui/textarea';

import { RichTextEditorDemo } from '../tiptap/rich-text-editor';

interface JournalEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function JournalEditor({ content, onChange }: JournalEditorProps) {
  return (
    <RichTextEditorDemo
      className="w-full rounded-xl"
      value={content}
      onChange={onChange}
    />
  );
}
