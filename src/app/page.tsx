import Editor from '@/components/Editor';
import MemoFilter from '@/components/MemoFilter';
import { NotionAPI } from 'notion-client';
import Main from './Main';
import SideBar from './SideBar';
import Head from 'next/head'

export default async function Home() {
  const api = new NotionAPI({
    activeUser: process.env.NOTION_ACTIVE_USER,
    authToken: process.env.NOTION_TOKEN_V2,
  });
  const recordMap = await api.getPage(process.env.NOTION_DATABASE_ID!, {});
  return (
    <div className="md:flex">
      <main className="  flex-grow shrink flex flex-col justify-start items-center overflow-hidden h-full  md:mr-60">
        <div className="w-full mt-4 ">
          <div className="mb-4">
            <Editor />
          </div>
            <MemoFilter />
          <section className="overflow-y-auto ">
            <Main recordMap={recordMap} />
          </section>
        </div>
      </main>
      <SideBar />
    </div>
  );
}
