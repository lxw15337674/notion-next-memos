'use client'
import Editor from "@/components/Editor";
import MemoView from "@/components/MemoView";
import RightSide from "@/components/HomeSideBar";
import useMemoStore from "@/store/memo";
import useTagStore from "@/store/tag";
import { useMount } from 'ahooks'
import InfiniteScroll from 'react-infinite-scroll-component';
import MemoFilter from "@/components/MemoFilter";
import { useEffect } from "react";

const style = {
  height: 100,
  border: "1px solid green",
  margin: 6,
  padding: 8
};

export default function Home() {
  const { memos, fetchInitData, fetchPagedData, databases } = useMemoStore()
  const { fetchTags } = useTagStore()
  useMount(() => {
    fetchInitData()
    fetchTags()
  })
  return (
    <>
      <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full  mr-40 
      ">
        <div className="w-full mt-8 pr-10">
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
              loader={<h4>Loading...</h4>}
              endMessage={
                <p
                  className=" text my-4 text-center"
                >
                  <b>---- 已全部加载 {memos.length} 条笔记 ----</b>
                </p>
              }
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
