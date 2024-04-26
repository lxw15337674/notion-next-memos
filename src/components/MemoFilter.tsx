'use client';
import classNames from 'classnames';
import Icon from './Icon';
import useFilterStore from '@/store/filter';
import { useDebounceFn, useUpdateEffect } from 'ahooks';
import useMemoStore from '@/store/memo';

interface Props {
  className?: string;
}

const MemoFilter = (props: Props) => {
  const {
    tagFilter,
    timeFilterText,
    setTimeFilter,
    removeTagFilter,
    clearFilter,
    textFilter,
    setTextFilter,
    hasFilter,
  } = useFilterStore();
  const { fetchInitData } = useMemoStore();
  const { run: debounceFetchData } = useDebounceFn(fetchInitData, {
    wait: 500,
  });
  useUpdateEffect(() => {
    debounceFetchData();
  }, [tagFilter, timeFilterText, textFilter]);
  if (!hasFilter) {
    return null;
  }
  return (
    <div
      className={classNames(
        `mb-4 w-full flex flex-row justify-start items-start flex-wrap gap-2 text-sm leading-7 dark:text-gray-400`,
        props.className,
      )}
    >
      <div className="shrink-0 flex flex-row justify-start items-center text-gray-400">
        <Icon.Filter className="w-4 h-auto mr-1" />
        <span>筛选器</span>
      </div>
      {textFilter && (
        <div
          className={
            ' flex justify-start items-center px-2 mr-2 cursor-pointer dark:text-gray-400 bg-gray-200 dark:bg-zinc-800 rounded  hover:line-through '
          }
          onClick={() => {
            setTextFilter('');
          }}
        >
          <div className="truncate max-w-xs ">关键字 : {textFilter}</div>
          <Icon.X className="w-4 h-auto ml-1 opacity-60" />
        </div>
      )}
      {timeFilterText && (
        <div
          className={
            ' flex justify-start items-center px-2 mr-2 cursor-pointer dark:text-gray-400 bg-gray-200 dark:bg-zinc-800 rounded  hover:line-through '
          }
          onClick={() => {
            setTimeFilter();
          }}
        >
          <div className="truncate max-w-xs ">日期 : {timeFilterText}</div>
          <Icon.X className="w-4 h-auto ml-1 opacity-60" />
        </div>
      )}
      {tagFilter.map((item) => (
        <div
          key={item}
          className={
            ' flex justify-start items-center px-2 mr-2 cursor-pointer dark:text-gray-400 bg-gray-200 dark:bg-zinc-800 rounded  hover:line-through '
          }
          onClick={() => {
            removeTagFilter(item);
          }}
        >
          <div className="truncate max-w-xs ">标签 : {item}</div>
          <Icon.X className="w-4 h-auto ml-1 opacity-60" />
        </div>
      ))}
      <div className="ml-auto">
        <div
          className={
            ' flex justify-start items-center px-6 mr-2 cursor-pointer  rounded  border  bg-background hover:bg-accent hover:text-accent-foreground '
          }
          onClick={clearFilter}
        >
          <div className="truncate max-w-xs ">重置</div>
        </div>
      </div>
    </div>
  );
};

export default MemoFilter;
