'use client'
import Editor from "@/components/Editor";
import MemoView from "@/components/MemoView/MemoView";
import RightSide from "@/components/HomeSideBar";
import useMemoStore from "@/store/memo";
import useTagStore from "@/store/tag";
import { useMount } from 'ahooks'
import InfiniteScroll from 'react-infinite-scroll-component';
import MemoFilter from "@/components/MemoFilter";
import useCountStore from "@/store/count";
import { getDBMeta } from "@/api/countAction";


export default function Home() {
  const { memos, fetchInitData, fetchPagedData, databases } = useMemoStore()
  const { fetchTags } = useTagStore()
  const { setRecordMap } = useCountStore()
  useMount(() => {
    fetchInitData()
    fetchTags()
    getDBMeta().then((map) => {
      setRecordMap(map)
    })
  })
  return (
    <>
      <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full  mr-60 
      ">
        <div className="w-full mt-4 ">
          <div className="mb-4">
            <Editor />
          </div>
          <div className="mb-4">
            <MemoFilter />
          </div>
          <section className="overflow-y-auto " >
            <InfiniteScroll
              dataLength={memos?.length}
              next={fetchPagedData}
              hasMore={databases.has_more}
              loader={
                <p
                  className=" text my-4 text-center text-muted-foreground"
                >
                  <b>Loading...</b>
                </p>
              }
              endMessage={
                <p
                  className=" text my-4 text-center text-muted-foreground"
                >
                  <b>---- 已全部加载 {memos.length} 条笔记 ----</b>
                </p>
              }
            >
              {
                memos.map((memo) => (
                  <MemoView key={memo.id} {...memo} />
                ))
              }
            </InfiniteScroll>
          </section>
        </div>
      </main>
      <RightSide />
    </>
  );
}
