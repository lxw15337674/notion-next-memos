'use client'
import React, { useState } from 'react';
import TagSelector from './ActionButton/TagSelector';
import useEditorStore from '@/store/editor';
import { IconButton } from '@mui/joy';
import Icon from '../Icon';
import { createPageInDatabase, getDBData } from '@/api/actions';
import useMemoStore from '@/store/memo';
import TagSuggestions from './TagSuggestions';


const Editor = () => {
    const { editorRef } = useEditorStore()
    const { fetchMemos } = useMemoStore()
    const onSave = async () => {
        const content = editorRef.current?.value ?? ''
        if (content.trim().length === 0) return
        await createPageInDatabase(content)
        await fetchMemos()
        editorRef.current!.value = ''
    }
    return (
        <div className="mb-2 pb-2 relative w-full flex flex-col justify-start items-start bg-white dark:bg-zinc-800 px-4 pt-4 rounded-lg border border-gray-200 dark:border-zinc-700" tabIndex={0}>
            <div className='flex flex-col justify-start items-start relative w-full h-auto max-h-[256px] bg-inherit dark:text-gray-300'>
                <textarea
                    className="w-full h-full my-1 text-base resize-none overflow-x-hidden overflow-y-auto bg-transparent outline-none whitespace-pre-wrap word-break"
                    rows={1}
                    placeholder="此刻的想法..."
                    style={{ height: '72px' }}
                    ref={editorRef}
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
        </div>
    );
};

export default Editor;