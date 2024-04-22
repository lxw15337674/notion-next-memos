'use client'
import React, { useState } from 'react';
import TagSelector from './ActionButton/TagSelector';
import useEditorStore from '@/store/editor';
import { IconButton, Textarea } from '@mui/joy';
import Icon from '../Icon';
import { createPageInDatabase, getDBData } from '@/api/actions';
import useMemoStore from '@/store/memo';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';



const Editor = () => {
    const { editorRef } = useEditorStore()
    const { fetchFirstData } = useMemoStore()
    const onSave = async () => {
        const content = editorRef.current?.value ?? ''
        if (content.trim().length === 0) return
        await createPageInDatabase(content)
        await fetchFirstData()
        editorRef.current!.value = ''
    }
    const [italic, setItalic] = React.useState(false);
    const [fontWeight, setFontWeight] = React.useState('normal');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    return (
        <div className="mb-2 pb-2 relative w-full flex flex-col justify-start items-start bg-white dark:bg-zinc-800 px-4 pt-4 rounded-lg border border-gray-200 dark:border-zinc-700" tabIndex={0} >
            <div className='flex flex-col justify-start items-start relative w-full h-auto max-h-[256px] bg-inherit dark:text-gray-300'>
                <Textarea
                    component="div" // Add the missing component prop
                    className="w-full h-full bg-transparent outline-none whitespace-pre-wrap word-break"
                    placeholder="此刻的想法..."
                    minRows={3}
                    variant="plain"
                    ref={(ref) => {
                        if (ref) {
                            editorRef.current = ref.children[0];
                        }
                    }}
                />
                <TagSuggestions />
            </div>
            <div className='flex justify-between w-full'>
                <div>
                    <TagSelector />
                </div>
                <div className="shrink-0 flex flex-row justify-end items-center">
                    <IconButton color="primary" variant="solid" className='px-4' onClick={onSave} >
                        <Icon.Send />
                    </IconButton>
                </div>
            </div>
            <Textarea
                placeholder="Type something here…"
                minRows={3}
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
                        <IconButton
                            variant="plain"
                            color="neutral"
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                        >
                            111
                        </IconButton>
                        <IconButton
                            variant={italic ? 'soft' : 'plain'}
                            color={italic ? 'primary' : 'neutral'}
                            aria-pressed={italic}
                            onClick={() => setItalic((bool) => !bool)}
                        >
                          123
                        </IconButton>
                        <Button sx={{ ml: 'auto' }}>Send</Button>
                    </Box>
                }
                sx={{
                    minWidth: 300,
                    fontWeight,
                    fontStyle: italic ? 'italic' : 'initial',
                }}
            />
        </div>
    );
};

export default Editor;