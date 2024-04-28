import React from 'react';

export interface CardProps {
    url?: string;
    content: string[];
    date: string;
    cardRef?: React.RefObject<HTMLDivElement>;
}

function XiaohongshuCard({ url, content, date, cardRef }: CardProps) {
    return (
        <div ref={cardRef} className="relative aspect-[3/4] w-96 bg-background  p-2">
            {/* 背景图片 */}
            {url && (
                <div
                    className=" inset-0 aspect-[3/4]  backdrop-filter backdrop-blur-none "
                    style={{
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                    }}
                />
            )}
            {/* 内容区域 */}
            <div className="relative w-full pt-2  dark:text-white text-gray-900">
                {/* 作者和日期 */}
                <div className="opacity-80 text-sm mb-1 flex justify-between">
                    <span>Bhwa233</span>
                    <span> {date}</span>
                </div>
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                    <div className="w-full text-xl font-cursive font-normal">
                        {content.map((item, index) => (
                            <p className="whitespace-pre-wrap" key={index}>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="text-right opacity-80">💭memos</div>
            </div>
        </div>
    );
}

export default XiaohongshuCard;