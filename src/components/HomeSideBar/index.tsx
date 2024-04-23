'use client'
import React, { useMemo } from 'react';
import Icon from '../Icon';
import useTagStore from '@/store/tag';
import TagsSection from './TagsSection';
import useMemoStore from '@/store/memo';
import { DayMemosItem } from '@/api/type';
import Count from './Count1';
import ActivityCalendar from '../ActivityCalendar';


const RightSide: React.FC = () => {
    return (
        <div className='h-screen
        group flex flex-col justify-start items-start    transition-all   px-4 py-4
         w-60 fixed right-0 top-0 '>
            <Count />
            <ActivityCalendar />
            <TagsSection />
        </div>
    );
};

export default RightSide;