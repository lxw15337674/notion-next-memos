import { Content } from '@/utils/parser';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ShareCardStore {
    text: Content[][];
    open: boolean;
    // 是否显示笔记中的标签
    isShowTags: boolean;
    toggleShowTags: () => void;
    openShareCord: (text: Content[][]) => void;
    setOpen: (open:boolean) => void;
}

const useShareCardStore = create<ShareCardStore>()(
    devtools(
        (set) => ({
            text: [],
            open: false,
            isShowTags: true,
            toggleShowTags: () => {
                set((state) => ({ isShowTags: !state.isShowTags }));
            },
            openShareCord: (text) => {
                set({ text, open: true });
            },
            setOpen: (open) => {
                set({ open });
            },
        }),
        {
            name: 'shareCardStore',
        },
    ),
);

export default useShareCardStore;
