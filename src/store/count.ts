import { Block, CollectionPropertySchema, CollectionPropertySchemaMap, ExtendedRecordMap, SelectOption } from 'notion-types';
import { create } from "zustand";
import computed from 'zustand-middleware-computed'
import { DayMemosItem } from '@/api/type';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface MemoStore {
    recordMap: ExtendedRecordMap | null;
    fetchRecordMap: (map: ExtendedRecordMap) => Promise<void>;
    setRecordMap: (recordMap: ExtendedRecordMap) => void;
}

type Property = CollectionPropertySchema & { id: string }


interface ComputedState {
    memos: Block[] // Update the type of memos property
    memosByDay: DayMemosItem[],
    schema: CollectionPropertySchemaMap
    contentSchema: Property | undefined
    tagSchema: Property | undefined
    allTags: SelectOption[]
    memosByTag: Map<string, number>
}

const useCountStore = create(devtools(persist(computed<MemoStore, ComputedState>(
    (set) => ({
        recordMap: null,
        fetchRecordMap: async (recordMap) => {
            set({ recordMap });
        },
        setRecordMap: (recordMap: ExtendedRecordMap) => {
            set({ recordMap });
        }
    }), {
    memos: (state) => {
        if (state.recordMap) {
            return Object.values(state.recordMap.block).slice(2).filter((block) => {
                return block.value.type === 'page';
            }).map((block) => block.value)
        }
        return []
    },
    memosByDay: (state) => {
        return state.memos.reduce<DayMemosItem[]>((acc, memo) => {
            const day = new Date(memo.created_time).toLocaleDateString()
            const index = acc.findIndex((item) => item.date === day)
            if (index !== -1) {
                acc[index].memos.push(memo.id)
            } else {
                acc.push({
                    date: day,
                    memos: [memo.id]
                })
            }
            return acc
        }, [])
    },
    allTags: (state) => {
        return state.tagSchema?.options ?? []
    },
    schema: (state) => {
        if (
            !state.recordMap ||
            !Object.values(state.recordMap.collection).length
        ) {
            return {}
        }
        return Object.values(state.recordMap.collection)[0].value.schema as CollectionPropertySchemaMap
    },
    contentSchema: (state) => {
        const item = Object.entries(state.schema).find(([key, value]) => value.name === 'content')
        return item ? { id: item[0], ...item[1] } : undefined
    },
    tagSchema: (state) => {
        const item = Object.entries(state.schema).find(([key, value]) => value.name === 'tags')
        return item ? { id: item[0], ...item[1] } : undefined
    },
    memosByTag: (state) => {
        const tagSchema = state.tagSchema
        if (!tagSchema) {
            return new Map()
        }
        const tagId = tagSchema.id
        const tagMap = new Map<string, number>()
        state.memos.forEach((memo) => {
            const tags = memo.properties[tagId][0][0].split(',') as string[]
            if (tags) {
                tags.forEach((tag) => {
                    if (!tagMap.has(tag)) {
                        tagMap.set(tag, 0)
                    }
                    tagMap.set(tag, tagMap.get(tag)! + 1)
                })
            }
        })
        
        return tagMap
    },
}), {
    name: 'count',
    storage: createJSONStorage(() => localStorage),
}), {
    name: 'count'
}
)
);

export default useCountStore