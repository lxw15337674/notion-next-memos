import { getDBData } from '@/api/actions';
import { DatabaseObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { create } from "zustand";
import computed from 'zustand-middleware-computed';
import { devtools } from "zustand/middleware";
import useFilterStore from './filter';

interface MemoStore {
    memos: DatabaseObjectResponse[]
    databases: QueryDatabaseResponse,
    fetchFirstData: () => void;
    fetchInitData: () => void;
    fetchPagedData: () => void;
}
interface ComputedState {
    // memos: DatabaseObjectResponse[]
}


const useMemoStore = create(computed<MemoStore, ComputedState>(
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
        // 获取最新的第一个数据,并插入
        fetchFirstData: async () => {
            const databases = await getDBData({ pageSize: 1 });
            set({
                databases,
                memos: [...databases.results as DatabaseObjectResponse[], ...get().memos]
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
            console.log(databases.results);
            set({
                databases,
                memos: [...get().memos, ...databases.results as DatabaseObjectResponse[]]
            });
        }
    }), {
})
);

export default useMemoStore