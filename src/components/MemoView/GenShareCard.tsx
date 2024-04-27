"use client";

import { toBlob } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import DrawDefaultPreview from "./Draw";
import { format } from "date-fns";

interface Props {
    text: string;
    urls: string[];
}


const GenShareCard = ({ text, token }: Props & { token: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const download = async () => {
        const card = ref.current;
        if (!card) return;
        try {
            const blob = await toBlob(card, {
                // width: card.clientWidth * 2,
                // height: card.clientHeight * 2,
                cacheBust: true,
                style: {
                    transform: "scale(2)",
                    transformOrigin: "top left",
                },
            });

            if (!blob) return;
            const name = `${format(new Date(), 'yyyy-MM-dd')}-${text.slice(0, 5)}...`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name}.png`;
            a.click();
        } catch (e) {
            console.error(e);
        }
    };

    const gen = async () => {
        await download();
    };

    return <>
        <div ref={ref}>
            <DrawDefaultPreview text={['当年在岐王宅里，', '常常见到你的演出']} />
        </div>
        <Button onClick={gen}>下载</Button>;
    </>
};


export default GenShareCard;