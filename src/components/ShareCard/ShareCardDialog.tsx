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
import { Checkbox } from "../ui/checkbox";
import SpotifyCard from "./SpotifyCard";

const image = "https://source.unsplash.com/random/1080x1920?wallpapers";

const getImageUrl = async () => {
    const res = await fetch(image);
    return res.url;
}

const ShardCards = [
    {
        name: '小红书风格',
        component: XiaohongshuCard
    },
    {
        name: '图片背景风格',
        component: ImageBackgroundCard
    },
    {
        name: 'Spotify风格',
        component: SpotifyCard
    }
]

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
    const { text, open, setOpen, toggleShowTags, isShowTags } = useShareCardStore();
    const { data: url, run } = useRequest(getImageUrl)
    const content = useMemo(() => {
        return text.map((content) => {
            return content.filter((item) => item.type === 'text' || isShowTags && item.type === 'tag')
        }).map((item) => {
            return item.map((i) => i.text).join('')
        });
    }, [text, isShowTags])
    const refs = useRef<HTMLDivElement[]>([]);

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:max-w-[100vw] w-auto overflow-auto">
                <DialogHeader>
                    <DialogTitle>生成分享图</DialogTitle>
                    <DialogDescription>
                        <div className="mt-2 flex justify-center ">
                            {
                                ShardCards.map((item, index) => {
                                    const { name, component: Card } = item;
                                    return <div className="mr-4 " key={index}>
                                        <div className="text-center md:text-base mb-2 text-white">{name}</div>
                                        <div className="border">
                                        <Card
                                            url={url}
                                            cardRef={ref => {
                                                if (ref) {
                                                    refs.current[index] = ref
                                                }
                                            }}
                                            content={content}
                                            date={format(new Date(), 'yyyy-MM-dd')}
                                        />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter >
                    <div className="items-center flex space-x-2 cursor-pointer">
                        <Checkbox id="terms1" checked={isShowTags}
                            onCheckedChange={toggleShowTags}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                保留标签
                            </label>
                        </div>
                    </div>
                    <Button variant="outline" onClick={run}>更换背景图</Button>
                    {
                        ShardCards.map((item, index) => {
                            return <Button key={index} variant="outline" onClick={() => imageDownload(refs.current[index])}>下载{item.name}</Button>
                        })
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
};


export default ShareCardDialog;