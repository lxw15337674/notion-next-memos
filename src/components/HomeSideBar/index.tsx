'use client'
import React from 'react';
import TagsSection from './TagsSection';
import Count from './Count';
import ActivityCalendar from '../ActivityCalendar';


const RightSide: React.FC = () => {
    return (
        <div className='h-screen
        hidden
        group md:flex flex-col justify-start items-start    transition-all   px-4 py-4
         w-60 fixed right-0 top-0 '>
            <Count />
            <ActivityCalendar />
            <TagsSection />
        </div>
    );
};

export default RightSide;