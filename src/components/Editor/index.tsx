'use client';
import React, { useRef } from 'react';
import { Textarea } from '@mui/joy';
import Icon from '../Icon';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import { Button } from '../ui/button';
import useTagStore from '@/store/tag';
import { Loader2 } from 'lucide-react';
import { useDebounceFn, useKeyPress } from 'ahooks';

interface Props {
  onSubmit: (text: string) => Promise<any>;
  onCancel?: () => void;
  defaultValue?: string;
}
const Editor = ({ onSubmit, defaultValue, onCancel }: Props) => {
  const { fetchTags } = useTagStore();
  const [loading, setLoading] = React.useState(false);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const { run: insertText } = useDebounceFn((text: string, offset = 0) => {
    const editor = editorRef.current;
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
      }, 100);
    }
  }, { wait: 200 });
  const onSave = async () => {
    const editor = editorRef.current;
    if (!editor) {
      return
    }
    const content = editor.value ?? '';
    if (content.trim().length === 0) return;
    setLoading(true);
    await onSubmit?.(content).finally(() => {
      setLoading(false);
    })
    fetchTags()
    editor!.value = '';
  };
  useKeyPress('ctrl.enter', (e) => {
    // 判断是否focus
    if (editorRef.current === document.activeElement) {
      e.preventDefault();
      e.stopPropagation();
      onSave();
    }
  });
  return (
    <div className="relative">
      <Textarea
        className="w-full h-full bg-card text-card-foreground"
        placeholder="此刻的想法..."
        minRows={3}
        autoFocus
        defaultValue={defaultValue}
        slotProps={{ textarea: { ref: editorRef } }}
        endDecorator={
          <Box
            className="py-1 border-t  flex items-center flex-auto "
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertText('#', 0)}
            >
              <Icon.Hash size={16} />
            </Button>
            <div className="flex items-center ml-auto">
              {onCancel && <Button
                disabled={loading}
                variant="ghost"
                size='icon'
                onClick={onCancel}
                className="w-16 h-8"
              >
                取消
              </Button>
              }
              <Button
                disabled={loading}
                variant="outline"
                size="icon"
                type='submit'
                onClick={onSave}
                className="ml-4 w-16 h-8"
              >
                {
                  loading ? <Loader2 size={20} className="animate-spin" /> : <Icon.Send size={20} />
                }
              </Button>
            </div>

          </Box>
        }
      />
      <TagSuggestions editorRef={editorRef} insertText={insertText} />
    </div>
  );
};

export default Editor;
