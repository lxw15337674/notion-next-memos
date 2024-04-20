'use client'

import MemoView from "@/components/MemoView";
import useMemoStore from "@/store/memo";
import { useMount } from "ahooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { ExtendedRecordMap } from "notion-types";

interface Props {
    recordMap: ExtendedRecordMap
}

export default function Home(props: Props) {
    const { recordMap } = props
    const { memos, setRecordMap } = useMemoStore()

    useMount(() => {
        setRecordMap(recordMap)
    })
    return (<InfiniteScroll
        dataLength={memos?.length}
        next={()=>{}}
        hasMore={false}
        loader={<h4>Loading...</h4>}
    >
        {
            memos?.map((memo, index) => (
                <MemoView key={index} {...memo} />
            ))
        }
    </InfiniteScroll>
    );
}
