import { faker } from '@faker-js/faker';
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

interface TagStore {
    tags: string[]
    // State Management Functions
    setState: (state: string[]) => void; // Allow partial updates

    fetchTags: (options?: { skipCache: boolean }) => Promise<Set<string>>;
    upsertTag: (tagName: string) => Promise<void>;
    batchUpsertTag: (tagNames: string[]) => Promise<void>;
    deleteTag: (tagName: string) => Promise<void>;

}

const useTagStore = create<TagStore>()(
    devtools(
        (set) => ({
            tags: Array.from({ length: 10 }, () => faker.lorem.word()),
            setState: (state: string[]) => set({ tags: state }),
            fetchTags: async () => {
                return new Set()
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