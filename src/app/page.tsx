'use client'
import MemoFilter from '@/components/MemoFilter';
import SideBar from './SideBar';
import NewMemoEditor from './NewMemoEditor';
import ShareCardDialog from '@/components/ShareCard/ShareCardDialog';
import MemoView from '@/components/MemoView/MemoView';
import useMemoStore from '@/store/memo';
import useTagStore from '@/store/tag';
import { useFavicon, useMount, useTitle } from 'ahooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import useCountStore from '@/store/count';
import { getDBMeta } from '@/api/actions';
import useConfigStore from '@/store/config';
import { useRouter } from 'next/navigation';
import LeftSide from '@/components/LeftSide';
import MobileHeader from '@/components/MobileHeader';

export default function Home() {
  useTitle('memos - 个人笔记本')
  useFavicon('/favicon.ico')
  const { memos, fetchInitData, fetchPagedData, databases } = useMemoStore();
  const { fetchTags } = useTagStore();
  const { setRecordMap } = useCountStore();
  const { setAccessCodePermission, config, setEditCodePermission, hasEditCodePermission } = useConfigStore();
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
    getDBMeta().then(setRecordMap)
  });

  return (
    <div className="h-full">
      <MobileHeader />
      <LeftSide />
      <div className="flex-1 md:ml-40 md:pl-6 px-4">
        <div className="md:flex">
          <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full  md:mr-60">
            <div className="w-full mt-4 ">
              <div className="mb-4" id='edit'>
                {
                  hasEditCodePermission && <NewMemoEditor />
                }
              </div>
              <MemoFilter />
              <section className="overflow-y-auto ">
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
              </section>
            </div>
          </main>
          <ShareCardDialog />
          <SideBar />
        </div>
      </div>
    </div>
  );
}

