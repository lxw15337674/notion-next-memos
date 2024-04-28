"use client";

import { toBlob } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
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
                        <div className="mt-2 flex justify-center text-white ">
                            <div
                                ref={ref}
                                className="relative aspect-[3/4] w-96 overflow-hidden bg-black">
                                <div
                                    id="draw-share-card-bg"
                                    className="absolute left-0 right-0 top-0 aspect-[3/4] h-full backdrop-filter backdrop-blur-none blur-[1px] opacity-80"
                                    style={{
                                        backgroundImage: `url(${url})`,
                                        backgroundSize: "cover",
                                    }}
                                />
                                <div
                                    className="absolute left-0 right-0 top-0 h-full opacity-40 backdrop-blur-none "
                                    style={{ backgroundColor: "#1F2937" }}
                                />
                                <div className="relative h-full w-full p-4">
                                    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                                        <div className="w-full text-center text-2xl font-cursive font-normal">
                                            {content.map((item, index) => (
                                                <p className="whitespace-pre-wrap" key={index}>{item}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 right-2 left-2 opacity-80 text-sm text-center ">
                                        <div> Bhwa233</div>
                                        <div> {format(new Date(), 'yyyy-MM-dd')}</div>
                                    </div>
                                    <div className="absolute bottom-2 right-2   text-sm text-center opacity-60">
                                        <div className="text-right">💭memos</div>
                                    </div>
                                </div>
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