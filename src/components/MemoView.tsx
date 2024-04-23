import { convertGMTDateToLocal, parseContent } from '@/utils';
import { MultiSelectPropertyItemObjectResponse, DatabaseObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import React, { useMemo } from 'react';
import Tag from './Tag';



const MemoView: React.FC<DatabaseObjectResponse> = ({ properties, last_edited_time }) => {
  const labelList = useMemo(() => {
    const tags = properties?.tags as unknown as MultiSelectPropertyItemObjectResponse;
    return tags?.multi_select?.map((item) => item.name);
  }, [properties.tags]);

  const time = useMemo(() => {
    return convertGMTDateToLocal(last_edited_time);
  }, [last_edited_time]);

  const renderContent = (content: RichTextItemResponse, index: number) => {
    if (content.type === 'text') {
      if (content.href) {
        return <a key={index} href={content.href} className="text-blue-500">{content.text.content}</a>;
      }
      const text = parseContent(content.text.content);
      return (
        <p key={index} className='break-words w-full leading-6	text-sm'>
          {text.map((item, subIndex) => {
            if (item.type === 'tag') {
              return (
                <Tag
                  className='bg-blue-100 text-blue-800 text-sm font-medium me-0.5 px-1 py-0.5  rounded dark:bg-blue-900 dark:text-blue-300 '
                  text={item.text.slice(1)}
                  key={subIndex} >
                  {item.text}
                </Tag>
              );
            }
            return item.text
          })}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="mb-4 px-4 py-2 rounded overflow-hidden shadow-lg bg-zinc-800 w-full">
      <div className="flex justify-between items-center text-xs">{time}</div>
      <div className="py-2">
        <div className="text-gray-300 text-sm">
          {
            (properties.content as any)?.rich_text?.map((item: RichTextItemResponse, index: number) => renderContent(item, index))
          }
        </div>
      </div>
      {/* <div>
        {labelList?.map((label, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >
            #{label}
          </span>
        ))}
      </div> */}
    </div>
  );
};

export default MemoView;
