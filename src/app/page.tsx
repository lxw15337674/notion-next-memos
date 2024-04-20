'use client'
import Editor from "@/components/Editor";
import MemoView from "@/components/MemoView";
import RightSide from "@/components/HomeSideBar";
import useMemoStore from "@/store/memo";
import useTagStore from "@/store/tag";
import { useMount } from 'ahooks'
import InfiniteScroll from 'react-infinite-scroll-component';


export default function Home() {
  const { memos, fetchMemos } = useMemoStore()
  const {  fetchTags } = useTagStore()
  useMount(() => {
    fetchMemos()
    fetchTags()
  })
  return (
    <>
      <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full  mr-40 
      ">
        <div className="w-full mt-8 pr-10">
          <div className="mb-8">
            <Editor />
          </div>
          <section className="overflow-y-auto " >
            <InfiniteScroll
              dataLength={memos.length}
              next={fetchMemos}
              hasMore={false}
              loader={<h4>Loading...</h4>}
            >
            {
              memos.map((memo, index) => (
                <MemoView key={index} {...memo} />
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
