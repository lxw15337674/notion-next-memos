import { getDBData } from '@/api/actions';
import { DatabaseObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { create } from "zustand";
import computed from 'zustand-middleware-computed';
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import useFilterStore from './filter';

interface MemoStore {
    memos: DatabaseObjectResponse[]
    databases: QueryDatabaseResponse,
    fetchInitData: () => void;
    fetchPagedData: () => void;
    removeMemo: (pageId: string) => number;
    insertMemo: (page: DatabaseObjectResponse, index: number) => void;
}
const useMemoStore = create(devtools(
    persist<MemoStore>(
        (set, get) => ({
            memos: [],
            databases: {
                object: "list",
                results: [],
                next_cursor: null,
                has_more: true,
                type: "page_or_database",
                page_or_database: {
                },
                request_id: "",
            },
            // 删除某条数据
            removeMemo:  (pageId: string) => {
                const index = get().memos.findIndex((item) => item.id === pageId);
                set({
                    memos:  get().memos.filter((item) => item.id !== pageId)
                });
                return index
            },
            // 插入数据
            insertMemo:  (page: DatabaseObjectResponse, index: number) => {
                const memos = get().memos;
                memos.splice(index, 0, page);
                set({
                    memos
                });
            },
            // 获取初始化数据
            fetchInitData: async () => {
                const databases = await getDBData({
                    filter: useFilterStore.getState().filterParams
                });
                set({
                    databases,
                    memos: databases.results as DatabaseObjectResponse[]
                });
            },
            fetchPagedData: async () => {
                const startCursor = get().databases.next_cursor ?? undefined;
                const databases = await getDBData({ startCursor, filter: useFilterStore.getState().filterParams });
                set({
                    databases,
                    memos: [...get().memos, ...databases.results as DatabaseObjectResponse[]]
                });
            }
        }), {
        name: 'memos-storage',
            storage: createJSONStorage(() => sessionStorage),
    })
    , {
        name: 'memo'
    })
);

export default useMemoStore