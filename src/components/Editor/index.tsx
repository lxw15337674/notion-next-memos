'use client';
import React, { useRef, useState } from 'react';
import { Textarea } from '@mui/joy';
import Icon from '../Icon';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import { Button } from '../ui/button';
import useTagStore from '@/store/tag';
import { useDebounceFn, useEventListener, useKeyPress } from 'ahooks';
import { useFileUpload } from './useFileUpload';
import ImageViewer from '../ImageViewer';
import { PhotoProvider } from 'react-photo-view';

interface Props {
  onSubmit: (text: string, fileUrls?: string[]) => Promise<any>;
  onCancel?: () => void;
  defaultValue?: string;
  defaultUrls?: string[];
}
export interface ReplaceTextFunction {
  (text: string, start: number, end: number, cursorOffset?: number): void
}

const Editor = ({ onSubmit, defaultValue, onCancel, defaultUrls }: Props) => {
  const { fetchTags } = useTagStore();
  const [loading, setLoading] = React.useState(false);
  const [editorRef, setEditorRef] = useState<HTMLTextAreaElement | null>(null);
  const { files, uploadFile, removeFile, isUploading, reset, pushFile } = useFileUpload(defaultUrls)
  const { run: replaceText } = useDebounceFn<ReplaceTextFunction>((text, start, end, offset = 0) => {
    const editor = editorRef;
    if (editor) {
      const value = editor.value;
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
    const editor = editorRef;
    if (!editor) {
      return
    }
    const content = editor.value ?? '';
    if (content.trim().length === 0) return;
    setLoading(true);
    await onSubmit?.(content, files?.map(item => item.url!)).finally(() => {
      setLoading(false);
    })
    fetchTags()
    editor!.value = '';
    reset()
  };
  useKeyPress('ctrl.enter', (e) => {
    // 判断是否focus
    if (editorRef === document.activeElement) {
      e.preventDefault();
      e.stopPropagation();
      onSave();
    }
  });

  useEventListener('paste', (e) => {
    if (editorRef === document.activeElement) {
      if (e?.clipboardData?.items?.length === 0) return
      const items = e?.clipboardData?.items as DataTransferItemList;

      for (let i = 0; i < items?.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          pushFile(items[i].getAsFile()!);
        }
      }
    }
  })
  const isLoading = loading || isUploading
  return (
    <div className="relative">
      <Textarea
        className="w-full h-full bg-card text-card-foreground"
        placeholder="此刻的想法..."
        minRows={3}
        autoFocus
        defaultValue={defaultValue}
        slotProps={{ textarea: { ref: setEditorRef } }}
        endDecorator={
          <div className='w-full max-w-full'>
            <PhotoProvider>
              <div className='flex space-x-1 pb-2'>
                {
                  files?.map((file, index) => {
                    return <ImageViewer
                      key={file.source}
                      loading={file.loading}
                      src={file.source} alt='file' className='h-[100px] w-[100px]' onDelete={() => {
                        removeFile(index)
                      }} />
                  })
                }
              </div>
            </PhotoProvider>
            <Box
              className="py-1 border-t  flex items-center flex-auto "
            >
              <Button
                variant="ghost"
                size="icon"
                title='插入标签'
                onClick={() => {
                  if (!editorRef) {
                    return
                  }
                  replaceText('#', editorRef?.selectionStart, editorRef?.selectionStart, 0)
                }
                }
              >
                <Icon.Hash size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title='插入图片，最大9张，单张最大5MB'
                onClick={() => {
                  if (!editorRef) {
                    return
                  }
                  uploadFile()
                }
                }
              >
                <Icon.Paperclip size={20} />
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
                  disabled={isLoading}
                  variant="outline"
                  size="icon"
                  type='submit'
                  onClick={onSave}
                  className="ml-4 w-16 h-8"
                >
                  {
                    isLoading ? <Icon.Loader2 size={20} className="animate-spin" /> : <Icon.Send size={20} />
                  }
                </Button>
              </div>

            </Box>
          </div>
        }
      />
      <TagSuggestions editorRef={editorRef} replaceText={replaceText} />
    </div>
  );
};

export default Editor;
