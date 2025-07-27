'use client';
import { Textarea } from '@/components/ui/textarea';

interface JournalEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function JournalEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
}: JournalEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Textarea
        // value={content}
        onChange={event_ => onChange(event_.target.value)}
        placeholder={placeholder}
        className="h-full resize-none p-4"
        rows={20}
        defaultValue={`Today was amazing! I got a promotion at work and celebrated with my family. I feel so grateful and excited about the future. Everything seems to be going well.`}
      />
    </div>
  );
}
