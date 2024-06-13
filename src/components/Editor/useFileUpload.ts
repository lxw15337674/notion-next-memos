import { useState } from 'react';
import { useToast } from '../ui/use-toast';

interface ParsedFile {
    source: string;
    name: string;
    size: number;
    file: File;
}


export const useFileUpload = () => {
    const [files, setFiles] = useState<ParsedFile[] | null>(null);
    const { toast } = useToast();
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
                    // 限制大小5MB
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
                        name: file.name,
                        size: file.size,
                        file,
                    })
                );
            if (selectedFiles.length !== files.length) {
                toast({
                    title: '已过滤部分文件',
                    description: '文件大小不能超过5MB，且仅支持图片文件, 最多上传9张图片',
                });
            }
            // 更新文件状态
            setFiles(selectedFiles);
            console.log(selectedFiles)
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

    return [files, uploadFile, removeFile] as const
};