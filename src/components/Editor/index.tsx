'use client'
import React from 'react';
import useEditorStore from '@/store/editor';
import { IconButton, Textarea } from '@mui/joy';
import Icon from '../Icon';
import { createPageInDatabase } from '@/api/actions';
import useMemoStore from '@/store/memo';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';



const Editor = () => {
    const { editorRef, insertText } = useEditorStore()
    const { fetchFirstData } = useMemoStore()
    const onSave = async () => {
        const content = editorRef.current?.value ?? ''
        if (content.trim().length === 0) return
        await createPageInDatabase(content)
        await fetchFirstData()
        editorRef.current!.value = ''
    }
    return (
        <div className='relative'> 
            <Textarea
                className="w-full h-full "
                placeholder="此刻的想法..."
                minRows={3}
                sx={{
                    backgroundColor: '#27272a',
                }}
                ref={(ref) => {
                    if (ref) {
                        //@ts-ignore
                        editorRef.current = ref.children[0];
                    }
                }}
                endDecorator={
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 'var(--Textarea-paddingBlock)',
                            pt: 'var(--Textarea-paddingBlock)',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            flex: 'auto',
                        }}
                    >
                        <IconButton onClick={() => insertText('#', 0)} >
                            <Icon.Hash size={18} />
                        </IconButton>
                        <Button onClick={onSave} sx={{ ml: 'auto' }}>  <Icon.Send size={18}/></Button>
                    </Box>
                }
            />
            <TagSuggestions />
        </div>
    );
};

export default Editor;