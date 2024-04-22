import { getAllLabels } from '@/api/actions';
import { TagType } from '@/type';
import { create } from "zustand";
import { devtools } from "zustand/middleware";



interface TagStore {
    tags: TagType[]
    fetchTags: () => Promise<void>;
    upsertTag: (tagName: string) => Promise<void>;
    batchUpsertTag: (tagNames: string[]) => Promise<void>;
    deleteTag: (tagName: string) => Promise<void>;
}

const useTagStore = create<TagStore>()(
    devtools(
        (set) => ({
            tags: [],
            fetchTags: async () => {
                const tags = await getAllLabels()
                set({ tags })
            },
            upsertTag: async (tagName: string) => {
            },
            batchUpsertTag: async (tagNames: string[]) => {
            },
            deleteTag: async (tagName: string) => {
            },
        }),
        {
            name: 'tag'
        }
    ),
)

export default useTagStore