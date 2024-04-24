'use client'
import React from 'react';
import useEditorStore from '@/store/editor';
import { Textarea } from '@mui/joy';
import Icon from '../Icon';
import { createPageInDatabase } from '@/api/actions';
import useMemoStore from '@/store/memo';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import { Button } from '../ui/button';
import useTagStore from '@/store/tag';

const Editor = () => {
    const { editorRef, insertText } = useEditorStore()
    const { insertMemo } = useMemoStore()
    const { fetchTags } = useTagStore()
    const onSave = async () => {
        const content = editorRef.current?.value ?? ''
        if (content.trim().length === 0) return
        const data = await createPageInDatabase(content)
        insertMemo(data, 0)
        fetchTags()
        editorRef.current!.value = ''
    }
    return (
        <div className='relative'>
            <Textarea
                className="w-full h-full bg-card text-card-foreground"
                placeholder="此刻的想法..."
                minRows={3}
                ref={(ref) => {
                    if (ref) {
                        //@ts-ignore
                        editorRef.current = ref.children[0];
                    }
                }}
                endDecorator={
                    <Box
                        className="pt-1"
                        sx={{
                            display: 'flex',
                            borderTop: '1px solid',
                            flex: 'auto',
                        }}
                    >
                        <Button variant="ghost" size="icon" onClick={() => insertText('#', 0)} >
                            <Icon.Hash size={16} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={onSave} className="ml-auto w-16" > <Icon.Send size={20} className='' /></Button>
                    </Box>
                }
            />
            <TagSuggestions />
        </div>
    );
};

export default Editor;