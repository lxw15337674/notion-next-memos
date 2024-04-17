import MemoView from "@/components/MemoView";

export default function Home() {
  return (
    <main className="w-full h-auto flex-grow shrink flex flex-col justify-start items-center">
      <section className="@container w-full max-w-5xl min-h-[100svh] flex flex-col justify-start items-center sm:pt-3 md:pt-6 pb-8">
        <MemoView />
      </section>
    </main>
  );
}
