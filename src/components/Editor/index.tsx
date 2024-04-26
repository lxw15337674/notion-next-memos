'use client';
import React, { useRef } from 'react';
import { Autocomplete, Textarea } from '@mui/joy';
import Icon from '../Icon';
import { createPageInDatabase } from '@/api/actions';
import useMemoStore from '@/store/memo';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import { Button } from '../ui/button';
import useTagStore from '@/store/tag';
import { useRequest } from 'ahooks';
import { Loader2 } from 'lucide-react';

const Editor = () => {
  const { insertMemo } = useMemoStore();
  const { fetchTags } = useTagStore();
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const editor = editorRef.current;
  const insertText = (text: string, offset = 0) => {
    if (editor) {
      const value = editor.value;
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const newValue = value.slice(0, start) + `${text} ` + value.slice(end);
      editor.value = newValue;
      setTimeout(() => {
        editor.selectionStart = start + text.length + offset;
        editor.selectionEnd = start + text.length + offset;
        editor.focus();
        // 触发事件
        const event = new Event('input');
        editor.dispatchEvent(event);
      }, 50);
    }
  }
  const { run: createRecord, loading } = useRequest(createPageInDatabase, {
    manual: true,
    onSuccess: (data) => {
      insertMemo(data, 0);
      fetchTags();
      editor!.value = '';
    }
  })
  const onSave = async () => {
    if (!editor) {
      return
    }
    const content = editor.value ?? '';
    if (content.trim().length === 0) return;
    await createRecord(content);
  };
  return (
    <div className="relative">
      <Textarea
        className="w-full h-full bg-card text-card-foreground"
        placeholder="此刻的想法..."
        minRows={3}
        slotProps={{ textarea: { ref: editorRef } }}
        endDecorator={
          <Box
            className="py-1 border-t  flex items-center flex-auto"

          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertText('#', 0)}
            >
              <Icon.Hash size={16} />
            </Button>
            <Button
              disabled={loading}
              variant="outline"
              size="icon"
              type='submit'
              onClick={onSave}
              className="ml-auto w-16 h-8"
            >
              {
                loading ? <Loader2 size={20} className="animate-spin" /> : <Icon.Send size={20} />
              }
            </Button>
          </Box>
        }
      />
      <TagSuggestions editorRef={editorRef} insertText={insertText} />
    </div>
  );
};

export default Editor;
