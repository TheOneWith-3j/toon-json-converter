import React, { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { json as jsonLang } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: "json" | "toon";
  highlightLine?: number;
}

export default function CodeMirrorEditor({
  value,
  onChange,
  readOnly,
  language = "json",
  highlightLine,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (viewRef.current) {
      viewRef.current.destroy();
    }
    const extensions = [
      basicSetup,
      oneDark,
      EditorView.editable.of(!readOnly),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      }),
    ];
    if (language === "json") {
      extensions.push(jsonLang());
    }
    // TODO: Add custom TOON highlighting extension
    const state = EditorState.create({
      doc: value,
      extensions,
    });
    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });
    // TODO: Highlight error line if highlightLine is set
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [value, readOnly, language, onChange, highlightLine]);

  return (
    <div
      ref={editorRef}
      className="w-full h-64 border rounded bg-neutral-100 dark:bg-neutral-900"
    />
  );
}
