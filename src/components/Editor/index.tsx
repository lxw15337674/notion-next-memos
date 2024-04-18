'use client'
import React, { useState } from 'react';
import TagSelector from './ActionButton/TagSelector';
import useEditorStore from '@/store/editor';

interface EditorProps {
    // Define the props for your component here
}

const Editor: React.FC<EditorProps> = () => {
    const { content, setContent, editorRef } = useEditorStore()
    return (
        <div className="mb-2 pb-2 relative w-full flex flex-col justify-start items-start bg-white dark:bg-zinc-800 px-4 pt-4 rounded-lg border border-gray-200 dark:border-zinc-700" tabIndex={0}>
            <textarea
                className="w-full h-full my-1 text-base resize-none overflow-x-hidden overflow-y-auto bg-transparent outline-none whitespace-pre-wrap word-break"
                rows={1}
                placeholder="此刻的想法..."
                style={{ height: '72px' }}
                ref={editorRef}
            />
            <div>
                <TagSelector />
            </div>
        </div>
    );
};

export default Editor;