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
import Editor from '../Editor';
import useMemoStore from '@/store/memo';
import { useRequest } from 'ahooks';
import { updatePageProperties } from '@/api/actions';

const MemoView: React.FC<DatabaseObjectResponse> = ({
  properties,
  last_edited_time,
  created_time,
  id,
}) => {
  const [isEdited, setIsEdited] = React.useState(false);
  const labelList = useMemo(() => {
    const tags = properties?.tags as unknown as MultiSelectPropertyItemObjectResponse;
    return tags?.multi_select?.map((item) => item.name);
  }, [properties.tags]);

  const time = useMemo(() => {
    return convertGMTDateToLocal(last_edited_time);
  }, [last_edited_time]);
  const { updateMemo } = useMemoStore();
  const { runAsync: updateRecord } = useRequest(updatePageProperties, {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        updateMemo(data)
        setIsEdited(false)
      }
    }
  })
  const isRecentTime = useMemo(() => {
    return Date.now() - new Date(created_time).getTime() < 1000 * 60 * 60 * 24
  }, [created_time])

  const paginationText = useMemo(() => {
    return (properties.content as any)?.rich_text?.map(
      (item: RichTextItemResponse) => item.plain_text,
    ) as string[]
  }, [
    properties.content
  ])

  const textRender = useMemo(() => {
    return paginationText.map((item, index) => {
      const text = parseContent(item)
      return (
        <p key={index} className="whitespace-pre-wrap break-words w-full leading-6	text-sm">
          {text.map((item, index) => {
            if (item.type === 'tag') {
              return null
              // TODO: 改成一個配置
              // return <Tag
              //   className="bg-blue-100 text-blue-800 font-medium me-0.5 px-1 py-0.5  rounded dark:bg-blue-900 dark:text-blue-300 "
              //   text={item.text}
              //   key={item.text}
              // >
              //   #{item.text}
              // </Tag>
            }
            return <span key={index}>{item.text}</span>
          })}
        </p>
      )
    })
  }, [paginationText])

  if (isEdited) {
    return (
      <div className='mb-2'>
        <Editor onSubmit={(text) => updateRecord(id, text)} defaultValue={paginationText.join('\n')}
          onCancel={() => setIsEdited(false)}
        />
      </div>
    );
  }
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
        <MemoActionMenu memoId={id} onEdit={() => setIsEdited(true)} />
      </div>
      <div className="font-medium">
        {textRender}
      </div>
      <div className='mt-4 pt-2'>
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
