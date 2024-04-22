import { getDBData } from '@/api/actions';
import { DatabaseObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { create } from "zustand";
import computed from 'zustand-middleware-computed';
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface MemoStore {
    // 后期可以做多重搜索
    filter: string[]
    setFilter: (filter: string[]) => void;
    removeFilter: () => void;
}
interface ComputedState {
    // memos: DatabaseObjectResponse[]
    filterParams?: Object
}


const useFilterStore = create(persist( computed<MemoStore, ComputedState>(
    (set, get) => ({
        filter: [],
        setFilter: (filter) => {
            set({ filter })
        },
        removeFilter: () => {
            set({
                filter: []
            })
        },
    }), {
    filterParams: (state) => {
        if (
            state.filter.length === 0
        ) {
            return undefined
        }
        return {
            "and": state.filter.map((item) => {
                return {
                    property: "tags",
                    multi_select: {
                        contains: item
                    }
                }
            }
            )
        }
    }
}),{
    name: 'filter',
    storage: createJSONStorage(() => localStorage),
}
)
);

export default useFilterStore