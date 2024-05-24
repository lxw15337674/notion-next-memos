'use client';
import React, { useCallback, useRef, useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { Textarea } from '@mui/joy';
import Icon from '../Icon';
import useTagStore from '@/store/tag';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import Box from '@mui/joy/Box';
import { useDebounceFn } from 'ahooks';
import defaultStyle from './defaultStyle'

interface Props {
  onSubmit: (text: string) => Promise<any>;
  onCancel?: () => void;
  defaultValue?: string;
}

const Editor = ({ onSubmit, defaultValue, onCancel }: Props) => {
  const { tags, fetchTags } = useTagStore();
  const [loading, setLoading] = React.useState(false);
  const [mentionValue, setMentionValue] = useState('');
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const onSave = useCallback(async () => {
    if (!editorRef.current) {
      return;
    }
    const content = editorRef.current.value ?? '';
    if (content.trim().length === 0) return;
    setLoading(true);
    await onSubmit?.(content).finally(() => {
      setLoading(false);
    });
    fetchTags();
    editorRef.current!.value = '';
  }, [fetchTags, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      onSave();
    }
  }, [onSave]);


  return (
    <div className="relative">
      <MentionsInput
        value={mentionValue}
        onChange={(event) => setMentionValue(event.target.value)}
        className="w-full h-full bg-card text-card-foreground min-h-[63px] p-2"
        placeholder="此刻的想法..."
        // Remove the inputComponent prop
        // inputComponent={Textarea}
        // style={defaultStyle}
        autoFocus={true}
        defaultValue={defaultValue}
        onKeyDown={handleKeyDown}
        inputRef={editorRef}
        allowSuggestionsAboveCursor
        allowSpaceInQuery
      >
        <Mention
          trigger="#"
          data={tags.map((tag) => ({ id: tag.id, display: tag.name }))}
          appendSpaceOnAdd
        />
      </MentionsInput>
      <Box
        className="py-1 border-t  flex items-center flex-auto "
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (!editorRef.current) {
              return;
            }
          }
          }
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
    </div>
  );
};

export default Editor;