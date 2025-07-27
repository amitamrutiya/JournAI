'use client';
// import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

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
  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Placeholder.configure({
  //       placeholder,
  //     }),
  //     CharacterCount.configure({
  //       limit: 10_000,
  //     }),
  //   ],
  //   immediatelyRender: false,
  //   content,
  //   onUpdate: ({ editor }) => {
  //     onChange(editor.getHTML());
  //   },
  //   editorProps: {
  //     attributes: {
  //       class:
  //         'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
  //     },
  //   },
  // });

  // Update editor content when prop changes (e.g., from PDF upload)
  // useEffect(() => {
  //   if (editor && content !== editor.getHTML()) {
  //     editor.commands.setContent(content);
  //   }
  // }, [content, editor]);

  // if (!editor) {
  //   return;
  // }

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Toolbar */}

      {/* Editor */}
      <div className="min-h-[300px]">{/* <SimpleEditor /> */}</div>

      {/* Character count */}
      {/* <div className="bg-muted/50 text-muted-foreground border-t px-4 py-2 text-xs">
        {editor.storage.characterCount.characters()} / 10,000 characters
      </div> */}
    </div>
  );
}
