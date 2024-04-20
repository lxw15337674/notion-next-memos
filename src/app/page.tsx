import Editor from "@/components/Editor";
import MemoView from "@/components/MemoView";
import RightSide from "@/components/HomeSideBar";
import useMemoStore from "@/store/memo";
import useTagStore from "@/store/tag";
import { useMount } from 'ahooks'
import InfiniteScroll from 'react-infinite-scroll-component';
import { getDBMeta } from "@/api/actions";
import Section from "./Section";

export default async  function Home() {
  const recordMap = await getDBMeta()
  return (
    <>
      <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full  mr-40 
      ">
        <div className="w-full mt-8 pr-10">
          <div className="mb-8">
            <Editor />
          </div>
          <section className="overflow-y-auto " >
            <Section recordMap={recordMap}/>
          </section>
        </div>
      </main>
      <RightSide />
    </>
  );
}
