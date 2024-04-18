import React from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface EditorStore {
    editorRef: React.RefObject<HTMLTextAreaElement>
}

const useEditorStore = create<EditorStore>()(
    devtools(
        (set) => ({
            editorRef: React.createRef<HTMLTextAreaElement>()
        }),
    ),
)

export default useEditorStore