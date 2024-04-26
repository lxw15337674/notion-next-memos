import { TextareaTypeMap } from '@mui/joy';
import React from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface EditorStore {
  editorRef?: React.RefObject<HTMLDivElement>;
  insertText: (text: string, offset?: number) => void;
}

const useEditorStore = create<EditorStore>()(
  devtools((set, get) => ({
    editorRef: React.createRef(),
    insertText: (text, offset = 0) => {
      const { editorRef } = get();
      const current = editorRef?.current?.children?.[0] as HTMLTextAreaElement;
      if (current) {
        if (current === null) return;
        const value = current.value;
        const start = current.selectionStart;
        const end = current.selectionEnd;
        const newValue = value.slice(0, start) + `${text} ` + value.slice(end);
        current.value = newValue;
        setTimeout(() => {
          current.selectionStart = start + text.length + offset;
          current.selectionEnd = start + text.length + offset;
          current.focus();
          // 触发事件
          const event = new Event('input');
          current.dispatchEvent(event);
        }, 50);
      }
    },
  })),
);

export default useEditorStore;
