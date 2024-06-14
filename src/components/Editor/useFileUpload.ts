import { useState } from 'react';
import { useToast } from '../ui/use-toast';

interface ParsedFile {
    source: string;
    size: number;
    file: File;
    url?: string;
    success?: boolean;
}


export const useFileUpload = (defaultUrls?: string[]) => {
    const [files, setFiles] = useState<ParsedFile[] | null>(() => {
        if (defaultUrls) {
            return defaultUrls.map(url => ({
                source: url,
                size: 0,
                file: new File([], url),
                url: url,
                success: true
            }))
        }
        return null
    })
    const { toast } = useToast();
    // 上传到图床
    const uploadToGallery = (file: File, index: number) => {
        const formData = new FormData();
        formData.append('file', file);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then((data) => {
                setFiles((files) => {
                    return files!.map((item, i) => {
                        if (i === index) {
                            return {
                                ...item,
                                url: `https://telegraph-image-bww.pages.dev${data[0]?.src}`,
                                success: true
                            }
                        }
                        return item
                    }
                    )
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const uploadFile = () => {
        // 创建 input 元素
        const inputEl = document.createElement('input');
        inputEl.type = 'file';
        inputEl.accept = 'image/*'; // 限制图片文件
        inputEl.multiple = true;
        // 处理文件选择
        const handleChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = Array.from(target.files || [])
            const selectedFiles = files
                .filter((file) => {
                    // // 限制大小5MB
                    if (file.size >= 5 * 1024 * 1024) {
                        return false
                    }
                    // 限制图片文件
                    if (!file.type.includes('image')) {
                        return false
                    }
                    return true
                }
                )
                .slice(0, 9) // 限制最多9张
                .map(
                    (file): ParsedFile => ({
                        source: URL.createObjectURL(file),
                        size: file.size,
                        file,
                    })
                );
            if (selectedFiles.length !== files.length) {
                toast({
                    title: '已过滤部分文件',
                    description: '文件大小不能超过5MB，仅支持图片文件, 最多上传9张图片',
                    variant: 'destructive',
                });
            }
            // 更新文件状态
            setFiles(selectedFiles);
            console.log(selectedFiles)
            for (let i = 0; i < selectedFiles.length; i++) {
                uploadToGallery(selectedFiles[i].file, i)
            }
            // 移除事件监听和 input 元素
            inputEl.removeEventListener('change', handleChange);
            inputEl.remove();
        };

        // 添加事件监听
        inputEl.addEventListener('change', handleChange);

        // 触发文件选择
        inputEl.click();
    }
    const removeFile = (index: number) => {
        files?.splice(index, 1);
        setFiles([...files!]);
    }
    const isUploading = files?.some((file) => !file.success) && files?.length > 0;
    const reset = () => {
        setFiles(null)
    }
    return [files, uploadFile, removeFile, isUploading, reset] as const
};