'use client';
import React, { useRef } from 'react';
import { Textarea } from '@mui/joy';
import Icon from '../Icon';
import { createPageInDatabase } from '@/api/actions';
import useMemoStore from '@/store/memo';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import { Button } from '../ui/button';
import useTagStore from '@/store/tag';

const Editor = () => {
  const { insertMemo } = useMemoStore();
  const { fetchTags } = useTagStore();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const insertText = (text: string, offset = 0) => {
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
  }
  const onSave = async () => {
    const editor = editorRef?.current?.children?.[0] as HTMLTextAreaElement;
    if (!editor) {
      return
    }
    const content = editor.value ?? '';
    if (content.trim().length === 0) return;
    const data = await createPageInDatabase(content);
    insertMemo(data, 0);
    fetchTags();
    editor.value = '';
  };
  return (
    <div className="relative">
      <Textarea
        className="w-full h-full bg-card text-card-foreground"
        placeholder="此刻的想法..."
        minRows={3}
        // ref={(ref) => {
        //   // (editorRef as any).current = ref?.children?.[0] as HTMLTextAreaElement
        // }}
        ref={editorRef}
        endDecorator={
          <Box
            className="pt-1"
            sx={{
              display: 'flex',
              borderTop: '1px solid',
              flex: 'auto',
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertText('#', 0)}
            >
              <Icon.Hash size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onSave}
              className="ml-auto w-16"
            >
              <Icon.Send size={20} className="" />
            </Button>
          </Box>
        }
      />
      <TagSuggestions editorRef={editorRef} insertText={insertText} />
    </div>
  );
};

export default Editor;
