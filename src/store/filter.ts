import { format } from 'date-fns';
import { create } from 'zustand';
import computed from 'zustand-middleware-computed';
import { createJSONStorage, persist } from 'zustand/middleware';

interface MemoStore {
  tagFilter: string[];
  timeFilter?: Date;
  textFilter?: string;
  setTextFilter: (text?: string) => void;
  setTimeFilter: (time?: Date) => void;
  setFilter: (tags: string[]) => void;
  removeTagFilter: (tag: string) => void;
  clearFilter: () => void;
}
interface ComputedState {
  // memos: DatabaseObjectResponse[]
  timeFilterText: string;
  filterParams?: Object;
  // 是否存在筛选
  hasFilter: boolean;
}

const useFilterStore = create(
  persist(
    computed<MemoStore, ComputedState>(
      (set, get) => ({
        tagFilter: [],
        setFilter: (tagFilter) => {
          set({ tagFilter });
        },
        setTextFilter: (text) => {
          set({ textFilter: text });
        },
        setTimeFilter: (time) => {
          set({ timeFilter: time });
        },
        removeTagFilter: (tag) => {
          set({
            tagFilter: get().tagFilter.filter((item) => item !== tag),
          });
        },
        clearFilter: () => {
          set({
            tagFilter: [],
            timeFilter: undefined,
            textFilter: undefined,
          });
        },
      }),
      {
        timeFilterText: (state) => {
          if (!state?.timeFilter) {
            return '';
          }
          return format(state.timeFilter, 'yyyy-MM-dd');
        },
        hasFilter: (state) => {
          return !!(
            state.tagFilter.length > 0 ||
            state.timeFilter ||
            state.textFilter
          );
        },
        filterParams: (state) => {
          if (!state.hasFilter) {
            return undefined;
          }
          let filter: object[] = state.tagFilter.map((item) => {
            return {
              property: 'tags',
              multi_select: {
                contains: item,
              },
            };
          });
          if (state.timeFilterText) {
            filter.push({
              timestamp: 'created_time',
              created_time: {
                equals: state.timeFilterText,
              },
            });
          }
          if (state.textFilter) {
            filter.push({
              property: 'content',
              rich_text: {
                contains: state.textFilter,
              },
            });
          }
          return {
            and: filter,
          };
        },
      },
    ),
    {
      name: 'filter',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useFilterStore;
