import { getData } from "@/api/notion";
import Editor from "@/components/Editor";
import MemoView from "@/components/MemoView";
import RightSide from "@/components/RightSide";
import { generateMemoData } from "@/utils/fakerData";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { useMemo } from "react";



export default async function Home() {
  const notionData = await getData()
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
              notionData.map((memo, index) => (
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
