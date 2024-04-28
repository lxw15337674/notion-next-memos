"use client";

import { useMemo, useRef } from "react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRequest } from "ahooks";
import useShareCardStore from "@/store/shareCard";
import ImageBackgroundCard from "./ImageBackgroundCard";
import XiaohongshuCard from "./XiaohongshuCard";
import { toBlob } from "html-to-image";


const image = "https://source.unsplash.com/random/1080x1920?wallpapers";

const getImageUrl = async () => {
    const res = await fetch(image);
    return res.url;
}

const imageDownload = async (card: HTMLDivElement) => {
    if (!card) return;
    try {
        const blob = await toBlob(card, {
            width: card.clientWidth * 2,
            height: card.clientHeight * 2,
            cacheBust: true,
            style: {
                transform: "scale(2)",
                transformOrigin: "top left",
            },
        });

        if (!blob) return;
        const name = `${format(new Date(), 'yyyy-MM-dd')}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.png`;
        a.click();
    } catch (e) {

    }
};
const ShareCardDialog = () => {
    const { text, open, setOpen } = useShareCardStore();
    const { data: url, run } = useRequest(getImageUrl)
    const content = useMemo(() => {
        return text.map((item) => {
            return item.map((i) => i.text).join('')
        });
    }, [text])
    const refs = useRef<HTMLDivElement[]>([]);

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[100vw] w-auto">
                <DialogHeader>
                    <DialogTitle>生成分享图</DialogTitle>
                    <DialogDescription>
                        <div className="mt-2 flex justify-center items-center">
                            <div
                                className="border"
                            >
                                <XiaohongshuCard
                                    url={url}
                                    cardRef={ref => {
                                        if (ref) {
                                            refs.current[0] = ref
                                        }
                                    }}
                                    content={content}
                                    date={format(new Date(), 'yyyy-MM-dd')}
                                />

                            </div>
                            <div
                                className="border ml-4"
                            >
                                <ImageBackgroundCard
                                    url={url}
                                    cardRef={ref => {
                                        if (ref) {
                                            refs.current[1] = ref
                                        }
                                    }}
                                    content={content}
                                    date={format(new Date(), 'yyyy-MM-dd')}
                                />

                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={run}>更换背景图</Button>
                    <Button variant="outline" onClick={
                        () => imageDownload(refs.current[0])
                    }>下载第一个</Button>
                    <Button variant="outline"
                        onClick={
                            () => imageDownload(refs.current[1])
                        }
                    >下载第二个</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
};


export default ShareCardDialog;