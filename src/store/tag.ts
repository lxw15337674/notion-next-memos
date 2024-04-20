import { getAllLabels } from '@/api/actions';
import { Tag } from '@/type';
import { faker } from '@faker-js/faker';
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";



interface TagStore {
    tags: Tag[]
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
    ),
)

export default useTagStore