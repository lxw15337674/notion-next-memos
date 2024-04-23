'use client'
import React, { useMemo } from 'react';
import Icon from '../Icon';
import useTagStore from '@/store/tag';
import TagsSection from './TagsSection';
import useMemoStore from '@/store/memo';
import { DayMemosItem } from '@/api/type';


const RightSide: React.FC = () => {
    const { tags } = useTagStore()
    const { memos } = useMemoStore()
    // 按create_time聚合，以天为单位
    const memosByDay = useMemo(() => memos.reduce<DayMemosItem[]>((acc, memo) => {
        const day = new Date(memo.created_time).toLocaleDateString()
        const index = acc.findIndex((item) => item.date === day)
        if (index !== -1) {
            acc[index].memos.push(memo.id)
        } else {
            acc.push({
                date: day,
                memos: [memo.id]
            })
        }
        return acc
    }, []), [
        memos
    ])
    return (
        <div className='
        group flex flex-col justify-start items-start select-none  dark:bg-opacity-40 transition-all hover:shadow-xl z-2  px-4 mt-8
         w-40 fixed right-0 top-0 '>
            <div className="w-full border  py-2 px-3 rounded-md space-y-0.5 text-gray-500 dark:text-gray-400 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="mb-1 w-full flex flex-row justify-between items-center">
                    <p className="text-sm font-medium leading-6 dark:text-gray-500">统计</p>
                </div>
                <div className="w-full flex justify-between items-center">
                    <div className="w-full flex justify-start items-center">
                        <Icon.CalendarDays className="w-4 h-auto mr-1" />
                        <span className="block text-base sm:text-sm">天</span>
                    </div>
                    <span className="font-mono">{memosByDay.length}</span>
                </div>
                <div className="w-full flex justify-between items-center">
                    <div className="w-full flex justify-start items-center">
                        <Icon.Library className="w-4 h-auto mr-1" />
                        <span className="block text-base sm:text-sm">笔记</span>
                    </div>
                    {memos.length}
                </div>
                <div className="w-full flex justify-between items-center">
                    <div className="w-full flex justify-start items-center">
                        <Icon.Hash className="w-4 h-auto mr-1" />
                        <span className="block text-base sm:text-sm">标签</span>
                    </div>
                    <span className="font-mono">{tags.length}</span>
                </div>
            </div>
            <TagsSection />
        </div>
    );
};

export default RightSide;