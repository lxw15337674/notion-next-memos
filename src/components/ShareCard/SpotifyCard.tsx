import React, { LegacyRef } from 'react';
import { CardProps } from './XiaohongshuCard';


function SpotifyCard({  content, date, cardRef, userName }: CardProps) {
    return (
        <div ref={cardRef} className="relative w-64   p-2 bg-[#77767c]">
            <div className="bg-[#898991] rounded-lg p-4 shadow-md">
                <div className="flex items-center mb-4">
                    <div>
                        <p className="text-black font-bold">{userName}</p>
                        <p className="text-gray-950 text-sm">{date}</p>
                    </div>
                </div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center w-full text-lg  font-bold text-black leading-relaxed">
                    {content.map((item, index) => (
                        <p className="whitespace-pre-wrap" key={index}>
                            {item}
                        </p>
                    ))}
                </div>
                <div className="mt-4 flex text-gray-950 font-bold">
                    💭memos
                </div>
            </div>

        </div>
    );
}

export default SpotifyCard;