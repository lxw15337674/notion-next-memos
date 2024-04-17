import { getData } from "@/api/notion";
import MemoView from "@/components/MemoView";
import RightSide from "@/components/RightSide";
import { generateMemoData } from "@/fakerData";
import { useMemo } from "react";



export default async function Home() {
  const data = useMemo(() => {
    return generateMemoData(5)
  }, [])
  const notionData = await getData()
  console.log(notionData)
  return (
    <>
      <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full 
      ">
        <section className="overflow-y-auto mr-40 pr-10" >
          {
            data.map((memo, index) => (
              <MemoView key={index} {...memo} />
            ))
          }
        </section>
      </main>
      <RightSide />
    </>
  );
}
