"use client";

import { useEffect, useRef, useState } from "react";
import { Decoration, EditorView } from "@codemirror/view";
import {
  Compartment,
  EditorState,
  StateEffect,
  StateField,
} from "@codemirror/state";
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

const highlightLineEffect = StateEffect.define<number | null>();
const highlightedLine = StateField.define<ReturnType<typeof Decoration.set>>({
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

export default function CodeMirrorEditor({
  value,
  onChange,
  readOnly,
  language = "json",
  highlightLine,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [languageCompartment] = useState(() => new Compartment());
  const [editableCompartment] = useState(() => new Compartment());

  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  });

  // Create the view exactly once; typing must never tear this down or focus is lost mid-keystroke.
  useEffect(() => {
    if (!editorRef.current) return;
    const extensions = [
      oneDark,
      highlightedLine,
      editableCompartment.of(EditorView.editable.of(!readOnly)),
      languageCompartment.of(language === "json" ? jsonLang() : toonLang),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current?.(update.state.doc.toString());
        }
      }),
    ];
    const state = EditorState.create({
      doc: valueRef.current,
      extensions,
    });
    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconfigure language/editable in place so cursor position and focus survive live changes.
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: languageCompartment.reconfigure(
        language === "json" ? jsonLang() : toonLang,
      ),
    });
  }, [language, languageCompartment]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: editableCompartment.reconfigure(
        EditorView.editable.of(!readOnly),
      ),
    });
  }, [readOnly, editableCompartment]);

  // Sync external value changes (presets, swap, clear, import) without disrupting active typing.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: highlightLineEffect.of(highlightLine ?? null),
    });
  }, [highlightLine]);

  return (
    <div
      ref={editorRef}
      className="w-full h-64 border rounded bg-neutral-100 dark:bg-neutral-900"
    />
  );
}
