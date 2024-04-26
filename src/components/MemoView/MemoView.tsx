'use client';
import {
  DatabaseObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import React, { useMemo } from 'react';
import Tag from '../Tag';
import MemoActionMenu from './MemoActionMenu';
import { Card } from '@/components/ui/card';
import { convertGMTDateToLocal, parseContent } from '@/utils/parser';
import "@github/relative-time-element";

const MemoView: React.FC<DatabaseObjectResponse> = ({
  properties,
  last_edited_time,
  created_time,
  id,
}) => {
  const labelList = useMemo(() => {
    const tags = properties?.tags as unknown as MultiSelectPropertyItemObjectResponse;
    return tags?.multi_select?.map((item) => item.name);
  }, [properties.tags]);

  const time = useMemo(() => {
    return convertGMTDateToLocal(last_edited_time);
  }, [last_edited_time]);
  const isRecentTime = useMemo(() => {
    return Date.now() - new Date(created_time).getTime() < 1000 * 60 * 60 * 24
  }, [created_time])

  const renderContent = (content: RichTextItemResponse, index: number) => {
    if (content.type === 'text') {
      // if (content.href) {
      //   return <Button asChild className="text-blue-500">
      //     <Link href={content.text.content}>
      //       {content.text.content}
      //     </Link>
      //   </Button>;
      // }
      return (
        <p key={index} className="whitespace-pre-wrap break-words w-full leading-6	text-sm">
          {content.plain_text}
        </p>
      );
    }
    return null;
  };

  return (
    <Card className="mb-2 px-2 py-2 rounded overflow-hidden  w-full">
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          {time}
          {isRecentTime &&
            <span className='ml-2'>
              ( <relative-time datetime={new Date(created_time).toISOString()} tense="past" /> )
            </span>
          }
        </div>
        <MemoActionMenu className="-ml-1" memoId={id} />
      </div>
      <div className="font-medium">
        {(properties.content as any)?.rich_text?.map(
          (item: RichTextItemResponse, index: number) =>
            renderContent(item, index),
        )}
      </div>
      <div className='mt-2'>
        {labelList?.map((label, index) => (
          <Tag
            className="bg-blue-100 text-blue-800 font-medium me-0.5 px-1 py-0.5  rounded dark:bg-blue-900 dark:text-blue-300 "
            text={label}
            key={label}
          >
            #{label}
          </Tag>
        ))}
      </div>
    </Card>
  );
};

export default MemoView;
