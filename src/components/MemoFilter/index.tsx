'use client';
import classNames from 'classnames';
import Icon from '../Icon';
import useFilterStore from '@/store/filter';
import { useDebounceFn, useUpdateEffect } from 'ahooks';
import useMemoStore from '@/store/memo';
import { Button } from '../ui/button';
import { FilterDropMenu } from './FilterDropMenu';
import FilterTag from './FilterTag';

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
    setHasImageFilter,
    hasImageFilter,
    textFilter,
    setTextFilter,
  } = useFilterStore();
  const { fetchInitData } = useMemoStore();
  const { run: debounceFetchData } = useDebounceFn(fetchInitData, {
    wait: 500,
  });
  useUpdateEffect(() => {
    debounceFetchData();
  }, [tagFilter, timeFilterText, textFilter, hasImageFilter]);
  return (
    <div
      className={classNames(
        `mb-4 w-full flex flex-row   flex-wrap gap-2 text-sm leading-7 dark:text-gray-400`,
        props.className,
      )}
    >
      <FilterDropMenu />
      <div className="flex justify-start items-center px-2 mr-2   text-gray-400">
        <Icon.Filter className="w-4 h-auto mr-1" />
        <div className='h-auto align-middle'>已有筛选</div>
      </div>
      {textFilter && (
        <FilterTag onClear={() => setTextFilter('')} >
          关键字 : {textFilter}
        </FilterTag>
      )}
      {timeFilterText && (
        <FilterTag onClear={() => setTimeFilter()}>
          日期 : {timeFilterText}
        </FilterTag>
      )}
      {
        hasImageFilter && (
          <FilterTag onClear={() => setHasImageFilter(false)}>
            只显示有图片
          </FilterTag>
        )
      }
      {tagFilter.map((item) => (
        <FilterTag key={item} onClear={() => removeTagFilter(item)}>
          标签 : {item}
        </FilterTag>
      ))}
      <div className="ml-auto">
        <Button variant="outline" size="sm" className='px-6 mr-2 ' onClick={clearFilter}>重置</Button>
      </div>
    </div>
  );
};

export default MemoFilter;
