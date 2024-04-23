'use client'
import classNames from "classnames";
import Icon from "./Icon";
import useFilterStore from "@/store/filter";
import { useUpdateEffect } from "ahooks";
import useMemoStore from "@/store/memo";
import { Button } from "./ui/button";

interface Props {
  className?: string;
}

const MemoFilter = (props: Props) => {
  const { filter, removeFilter, clearFilter } = useFilterStore()
  const { fetchInitData } = useMemoStore()
  useUpdateEffect(() => {
    fetchInitData()
  }, [filter])
  if (!filter.length) {
    return null;
  }

  return (
    <div
      className={classNames(
        `w-full flex flex-row justify-start items-start flex-wrap gap-2 text-sm leading-7 dark:text-gray-400`,
        props.className,
      )}
    >
      <div className="shrink-0 flex flex-row justify-start items-center text-gray-400">
        <Icon.Filter className="w-4 h-auto mr-1" />
        <span>筛选器</span>
      </div>
      {
        filter.map((item, index) => (
          <div
            key={item}
            className={
              "max-w-xs flex flex-row justify-start items-center px-2 mr-2 cursor-pointer dark:text-gray-400 bg-gray-200 dark:bg-zinc-800 rounded whitespace-nowrap truncate hover:line-through "
            }
            onClick={() => {
              removeFilter(item)
            }}
          >
            #{item}
            <Icon.X className="w-4 h-auto ml-1 opacity-40" />
          </div>
        ))
      }
      <div className="ml-auto" >
        <Button variant="outline" onClick={clearFilter} size="sm" className="leading-7 h-7">重置</Button>
      </div>
    </div>
  );
};

export default MemoFilter;
