import { getDBData } from '@/api/actions';
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { create } from "zustand";
import {  devtools } from "zustand/middleware";

interface MemoStore {
    memos: DatabaseObjectResponse[]
    fetchMemos: () => void;
}

const useMemoStore = create<MemoStore>()(
    devtools(
        (set) => ({
            memos:[],
            fetchMemos: async () => {
                const memos = await getDBData()
                set({ memos })
            },
        }),
    ),
)

export default useMemoStore