'use client'
import Editor from "@/components/Editor";
import MemoView from "@/components/MemoView";
import RightSide from "@/components/HomeSideBar";
import useMemoStore from "@/store/memo";
import useTagStore from "@/store/tag";
import { useMount } from 'ahooks'


export default function Home() {
  const { memos, fetchMemos } = useMemoStore()
  const { tags, fetchTags } = useTagStore()
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
            {
              memos.slice(0,10).map((memo, index) => (
                <MemoView key={index} {...memo} />
              ))
            }
          </section>
        </div>
      </main>
      <RightSide />
    </>
  );
}
