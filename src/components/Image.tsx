import React from 'react';
import { Button } from './ui/button';
import Icon from './Icon';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    onDelete: () => void;
}

const Image: React.FC<ImageProps> = ({ src, alt, onDelete, className }) => {
    return (
        <div className={`relative  ${className} rounded-lg overflow-hidden`}>
            <img src={src} alt={alt} className="object-cover w-full h-full rounded-lg" />
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-2  text-white   focus:outline-none rounded-lg opacity-70 h-[16px] w-[16px] flex justify-center items-center hover:opacity-100"
                onClick={onDelete}
            >
                <Icon.CircleX size={20} />
            </Button>
        </div>
    );
};

export default Image;

