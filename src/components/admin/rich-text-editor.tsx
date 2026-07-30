"use client";

import { useRef } from "react";

const BUTTONS: { command: string; label: string; arg?: string }[] = [
  { command: "bold", label: "B" },
  { command: "italic", label: "I" },
  { command: "underline", label: "U" },
  { command: "insertUnorderedList", label: "• List" },
  { command: "insertOrderedList", label: "1. List" },
];

export function RichTextEditor({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  function syncToHiddenInput() {
    if (editorRef.current && hiddenInputRef.current) {
      hiddenInputRef.current.value = editorRef.current.innerHTML;
    }
  }

  function exec(command: string) {
    editorRef.current?.focus();
    document.execCommand(command);
    syncToHiddenInput();
  }

  function insertLink() {
    const url = window.prompt("Link URL:");
    if (!url) return;
    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    syncToHiddenInput();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <div className="mt-1 rounded-md border border-neutral-300">
        <div className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 p-1">
          {BUTTONS.map((btn) => (
            <button
              key={btn.command}
              type="button"
              onClick={() => exec(btn.command)}
              className="rounded px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={insertLink}
            className="rounded px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
          >
            Link
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncToHiddenInput}
          onBlur={syncToHiddenInput}
          className="min-h-[160px] px-3 py-2 text-sm focus:outline-none"
          dangerouslySetInnerHTML={{ __html: defaultValue ?? "" }}
        />
      </div>
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={defaultValue ?? ""} />
    </div>
  );
}
