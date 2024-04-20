import { getDBMeta } from '@/api/actions';
import { Block, CollectionPropertySchema, CollectionPropertySchemaMap, ExtendedRecordMap, SelectOption } from 'notion-types';
import { create } from "zustand";
import computed from 'zustand-middleware-computed'
import { DayMemosItem } from '@/api/type';

interface MemoStore {
    recordMap: ExtendedRecordMap | null;
    fetchRecordMap: () => Promise<void>;
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
}

const useMemoStore = create(computed<MemoStore, ComputedState>(
    (set) => ({
        recordMap: null,
        fetchRecordMap: async () => {
            const recordMap = await getDBMeta();
            set({ recordMap });
        },
        setRecordMap: (recordMap: ExtendedRecordMap) => {
            set({ recordMap });
        }
    }), {
    memos: (state) => {
        if (state.recordMap) {
            return Object.values(state.recordMap.block).filter((block) => {
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
        // return Object.values(state.schema).find(item => item.name === 'content')
        const item = Object.entries(state.schema).find(([key, value]) => value.name === 'content')
        return item ? { id: item[0], ...item[1] } : undefined
    },
    tagSchema: (state) => {
        const item = Object.entries(state.schema).find(([key, value]) => value.name === 'tags')
        return item ? { id: item[0], ...item[1] } : undefined
    },
    allTags: (state) => {
        return state.tagSchema?.options ?? []
    }
})
);

export default useMemoStore