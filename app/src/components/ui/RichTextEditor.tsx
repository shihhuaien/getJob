"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const [isEmpty, setIsEmpty] = useState(!value);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
      const html = editor.getHTML();
      onChange(editor.isEmpty ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[96px] outline-none text-sm text-text",
      },
    },
  });

  // 同步外部 value 變動（例如 AI 最佳化寫入）
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (current !== incoming && !(editor.isEmpty && incoming === "")) {
      editor.commands.setContent(incoming);
      setIsEmpty(editor.isEmpty);
    }
  }, [value, editor]);

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${
      active
        ? "bg-brand-100 text-brand-700"
        : "text-text-light hover:bg-brand-50 hover:text-brand-700"
    }`;

  return (
    <div
      className={`mt-1 rounded-lg border border-brand-200 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 ${className ?? ""}`}
    >
      {/* 工具列 */}
      <div className="flex items-center gap-0.5 border-b border-brand-100 px-2 py-1">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={toolbarBtn(editor.isActive("bold"))}
          title="粗體"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={toolbarBtn(editor.isActive("italic"))}
          title="斜體"
        >
          <Italic size={14} />
        </button>
        <div className="mx-1 h-4 w-px bg-brand-200" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={toolbarBtn(editor.isActive("bulletList"))}
          title="項目符號"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={toolbarBtn(editor.isActive("orderedList"))}
          title="有序清單"
        >
          <ListOrdered size={14} />
        </button>
      </div>

      {/* 編輯區 */}
      <div className="relative px-3 py-2">
        {placeholder && isEmpty && (
          <span className="pointer-events-none absolute left-3 top-2 text-sm text-text-placeholder select-none">
            {placeholder}
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
