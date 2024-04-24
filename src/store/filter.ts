import { format } from "date-fns";
import { create } from "zustand";
import computed from 'zustand-middleware-computed';
import { createJSONStorage, persist } from "zustand/middleware";

interface MemoStore {
    tagFilter: string[];
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
        tagFilter: [],
        setFilter: (tagFilter) => {
            set({ tagFilter })
        },
        setTimeFilter: (time) => {
            set({ timeFilter: time })
        },
        removeFilter: (tag) => {
            set({
                tagFilter: get().tagFilter.filter((item) => item !== tag)
            })
        },
        clearFilter: () => {
            set({
                tagFilter: [],
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
            state.tagFilter.length === 0 && !state.timeFilter
        ) {
            return undefined
        }
        let filter: object[] = state.tagFilter.map((item) => {
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