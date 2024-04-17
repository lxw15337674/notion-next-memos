import React from 'react';

interface MemoViewProps {
  content: string;
  labels: string[];
  time: string;
}

const MemoView: React.FC<MemoViewProps> = (props) => {
  const { content, labels=[] ,time} = props;
  return (
    <div className="my-6 px-4  py-4 rounded overflow-hidden shadow-lg bg-zinc-800 w-full">
      <div className='flex justify-between items-center text-xs '>
        {time}
      </div>
        <div className="py-4">
          <p className="text-gray-300 text-sm">
            {content}
          </p>
        </div>
        <div className=" ">
          {labels.map((label) => (
            <span key={label} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #{label}
            </span>
          ))}
        </div>
    </div>
  );
};

export default MemoView;
 