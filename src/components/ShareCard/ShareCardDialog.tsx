"use client";

import { toBlob } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useRequest } from "ahooks";
import useShareCardStore from "@/store/shareCard";
import ImageBackgroundCard from "./ImageBackgroundCard";
import XiaohongshuCard from "./XiaohongshuCard";


const image = "https://source.unsplash.com/random/1080x1920?wallpapers";

const getImageUrl = async () => {
    const res = await fetch(image);
    return res.url;
}

const ShareCardDialog = () => {
    const { text, open, setOpen } = useShareCardStore();
    const ref = useRef<HTMLDivElement>(null);
    const { data: url, run } = useRequest(getImageUrl)
    const content = useMemo(() => {
        return text.map((item) => {
            return item.map((i) => i.text).join('')
        });
    }, [text])
    const download = async () => {
        const card = ref.current;
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
            const name = `${format(new Date(), 'yyyy-MM-dd')}...`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name}.png`;
            a.click();
        } catch (e) {

        }
    };
    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>生成分享图</DialogTitle>
                    <DialogDescription>
                        <div className="mt-2 flex justify-center  ">
                            <div
                              className="border"
                            >
                                 <XiaohongshuCard
                                    url={url }
                                    cardRef={ref}
                                    content={content}
                                    date={format(new Date(), 'yyyy-MM-dd')}
                                /> 
                                
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={run}>更换背景图</Button>
                    <Button onClick={download}>下载</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
};


export default ShareCardDialog;