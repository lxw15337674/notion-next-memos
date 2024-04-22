import { getDBData } from '@/api/actions';
import { DatabaseObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { create } from "zustand";
import computed from 'zustand-middleware-computed';
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import useFilterStore from './filter';

interface MemoStore {
    memos: DatabaseObjectResponse[]
    databases: QueryDatabaseResponse,
    addRecord: (page: DatabaseObjectResponse) => void;
    fetchInitData: () => void;
    fetchPagedData: () => void;
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
            // 插入第一行数据
            addRecord: async (page) => {
                set({
                    memos: [page, ...get().memos]
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
            storage: createJSONStorage(() => localStorage),
    })
    , {
        name: 'memo'
    })
);

export default useMemoStore