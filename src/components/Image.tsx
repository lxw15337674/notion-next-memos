'use client';
import React from 'react';
import { Button } from './ui/button';
import Icon from './Icon';
import { PhotoView } from 'react-photo-view';

interface ImageProps {
    src: string;
    alt: string;
    success?: boolean;
    className?: string;
    onDelete?: () => void;
}

const Image: React.FC<ImageProps> = ({ src, alt, onDelete, className, success }) => {
    return (
        <PhotoView src={src}>
            <div className={`relative   rounded-lg overflow-hidden h-full  ${success === false ? 'opacity-50' : ''}`}>
                <img src={src} alt={alt} className={`object-cover rounded-lg  ${className}`} />
                {
                    onDelete && <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-2  text-white   focus:outline-none rounded-lg opacity-70 h-[16px] w-[16px] flex justify-center items-center hover:opacity-100"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        <Icon.CircleX size={20} />
                    </Button>
                }
            </div>
        </PhotoView>
    );
};

export default Image;

