"use client";

import { useEffect, useRef } from "react";
import { Decoration, EditorView } from "@codemirror/view";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { json as jsonLang } from "@codemirror/lang-json";
import { StreamLanguage } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";

const toonLang = StreamLanguage.define({
  startState: () => ({}),
  token(stream) {
    if (stream.eatSpace()) return null;
    if (stream.match(/^[\w-]+(?=\s*:)/)) return "propertyName";
    if (stream.match(/^[-[\]{},:]/)) return "punctuation";
    if (stream.match(/^"(?:[^"\\]|\\.)*"/)) return "string";
    if (stream.match(/^(?:true|false|null)\b/)) return "bool";
    if (stream.match(/^-?\d+(?:\.\d+)?/)) return "number";
    stream.next();
    return null;
  },
});

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
    const highlightLineEffect = StateEffect.define<number | null>();
    const highlightedLine = StateField.define<
      ReturnType<typeof Decoration.set>
    >({
      create: () => Decoration.none,
      update: (decorations, transaction) => {
        decorations = decorations.map(transaction.changes);
        for (const effect of transaction.effects) {
          if (effect.is(highlightLineEffect)) {
            if (
              effect.value === null ||
              effect.value < 1 ||
              effect.value > transaction.state.doc.lines
            ) {
              decorations = Decoration.none;
            } else {
              const line = transaction.state.doc.line(effect.value);
              decorations = Decoration.set([
                Decoration.line({ class: "cm-error-line" }).range(line.from),
              ]);
            }
          }
        }
        return decorations;
      },
      provide: (field) => EditorView.decorations.from(field),
    });
    const extensions = [
      oneDark,
      highlightedLine,
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
    } else {
      extensions.push(toonLang);
    }
    const state = EditorState.create({
      doc: value,
      extensions,
    });
    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });
    viewRef.current.dispatch({
      effects: highlightLineEffect.of(highlightLine ?? null),
    });
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
