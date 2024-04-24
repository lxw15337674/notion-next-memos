import { format } from "date-fns";
import { create } from "zustand";
import computed from 'zustand-middleware-computed';
import { createJSONStorage, persist } from "zustand/middleware";

interface MemoStore {
    filter: string[];
    timeFilter?: Date;
    setTimeFilter: (time?: Date) => void;
    setFilter: (tags: string[]) => void;
    removeFilter: (tag: string) => void;
    clearFilter: () => void;
}
interface ComputedState {
    // memos: DatabaseObjectResponse[]
    timeFilterText: string
    filterParams?: Object
}


const useFilterStore = create(persist(computed<MemoStore, ComputedState>(
    (set, get) => ({
        filter: [],
        setFilter: (filter) => {
            set({ filter })
        },
        setTimeFilter: (time) => {
            set({ timeFilter: time })
        },
        removeFilter: (tag) => {
            set({
                filter: get().filter.filter((item) => item !== tag)
            })
        },
        clearFilter: () => {
            set({
                filter: [],
                timeFilter: undefined
            })
        }
    }), {
    timeFilterText: (state) => {
        if (!state?.timeFilter) {
            return ''
        }
        return format(state.timeFilter, 'yyyy-MM-dd')
    },
    filterParams: (state) => {
        if (
            state.filter.length === 0 && !state.timeFilter
        ) {
            return undefined
        }
        let filter: object[] = state.filter.map((item) => {
            return {
                property: "tags",
                multi_select: {
                    contains: item
                }
            }
        }
        )
        if (state.timeFilterText) {
            filter.push({
                timestamp: "created_time",
                created_time: {
                    equals: state.timeFilterText
                }
            })
        }
        return {
            "and": filter
        }
    }
}), {
    name: 'filter',
    storage: createJSONStorage(() => sessionStorage),
}
)
);

export default useFilterStore