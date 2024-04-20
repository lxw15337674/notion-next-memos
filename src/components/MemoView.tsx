import useMemoStore from '@/store/memo';
import { convertGMTDateToLocal, separateTextAndLabels } from '@/utils';
import { MultiSelectPropertyItemObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { Block } from 'notion-types';
import React, { useMemo } from 'react';


const renderContent = (content: RichTextItemResponse) => {
  if (content.type === 'text') {
    if (content.href) {
      return <a href={content.href} className="text-blue-500">{content.text.content}</a>
    }
    const text = separateTextAndLabels(content.text.content)
    return <p key={content.text.content}>
      {text.map((item, index) => {
        if (item.startsWith('#')) {
          return <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{item}</span>
        }
        return <span key={index}>{item}</span>
      })}
    </p>
  }
  return ''
}


const MemoView: React.FC<Block> = (props) => {
  const { contentSchema } = useMemoStore()
  // todo
  const text = useMemo(() => {
    return  props.properties[contentSchema?.id!]?.map((item: RichTextItemResponse) => renderContent(item));
  }, [props.properties]);
  const labelList = useMemo(() => {
    const labels = props.properties?.labels as unknown as MultiSelectPropertyItemObjectResponse;
    return labels?.multi_select.map((item) => item.name);
  }, [props.properties]);
  const time = useMemo(() => {
    return convertGMTDateToLocal(props.created_time)
  }, [props.created_time]);
  return (
    <div className="mb-6 px-4  py-4 rounded overflow-hidden shadow-lg bg-zinc-800 w-full">
      <div className='flex justify-between items-center text-xs '>
        {time}
      </div>
      <div className="py-4">
        <p className="text-gray-300 text-sm">
          {text}
        </p>
      </div>
      <div className=" ">
        {labelList?.map((label) => (
          <span key={label} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            #{label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MemoView;
