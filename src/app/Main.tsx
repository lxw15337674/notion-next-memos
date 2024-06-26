'use client';
import MemoView from '@/components/MemoView/MemoView';
import useMemoStore from '@/store/memo';
import useTagStore from '@/store/tag';
import { useFavicon, useMount, useTitle } from 'ahooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import useCountStore from '@/store/count';
import { ExtendedRecordMap } from 'notion-types';
import { useRouter } from 'next/navigation';
import useConfigStore from '@/store/config';
interface Props {
    recordMap: ExtendedRecordMap;
}

export default function Home({ recordMap }: Props) {
    useTitle('Nmemos')
    useFavicon('/favicon.ico')
    const { memos, fetchInitData, fetchPagedData, databases } = useMemoStore();
    const { fetchTags } = useTagStore();
    const { setRecordMap } = useCountStore();
    const { setAccessCodePermission, config, setEditCodePermission } = useConfigStore();
    const router = useRouter();
    useMount(() => {
        setAccessCodePermission(config.codeConfig.accessCode).then((hasAccessCodePermission) => {
            if (!hasAccessCodePermission) {
                router.push('/login')
                return
            }
        });
        setEditCodePermission(config.codeConfig.editCode);
        fetchInitData();
        fetchTags();
        setRecordMap(recordMap);
    });
    return (
        <InfiniteScroll
            dataLength={memos?.length}
            next={fetchPagedData}
            hasMore={databases.has_more}
            loader={
                <p className=" text my-4 text-center text-muted-foreground">
                    <b>Loading...</b>
                </p>
            }
            endMessage={
                <p className=" text my-4 text-center text-muted-foreground">
                    <b>---- 已全部加载 {memos.length} 条笔记 ----</b>
                </p>
            }
        >
            {memos.map((memo) => (
                <MemoView key={memo.id} {...memo} />
            ))}
        </InfiniteScroll>
    );
}