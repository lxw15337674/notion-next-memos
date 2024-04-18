import { Dropdown, IconButton, Menu, MenuButton } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import useEditorStore from "@/store/editor";
import useTagStore from "@/store/tag";

interface Props {
}

const TagSelector = (props: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { editorRef } = useEditorStore()
  const { tags } = useTagStore()

  const handleTagClick = (tag: string) => {
    const current = editorRef.current;
    if (current === null) return;
    const value = current.value;
    const start = current.selectionStart;
    const end = current.selectionEnd;
    const text = value.slice(start, end);
    // 插入
    const newValue = value.slice(0, start) + `#${tag} ` + value.slice(end);
    current.value = newValue;
    // 定位光标到标签后面 (关键修改)
    setTimeout(() => {
      current.selectionStart = start + tag.length + 2; // +2 to account for "#" and space
      current.selectionEnd = start + tag.length + 2;
      current.focus();
    }, 0);
  };

  return (
    <Dropdown open={open} onOpenChange={(_, isOpen) => setOpen(isOpen)}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            size: "sm",
          },
        }}
      >
        <Icon.Hash className="w-5 h-5 mx-auto" />
      </MenuButton>
      <Menu className="relative text-base" component="div" placement="bottom-start">
        <div ref={containerRef}>
          {tags.length > 0 ? (
            <div className="flex-row justify-start items-start flex-wrap px-1 max-w-[12rem] h-auto max-h-48 overflow-y-auto font-mono">
              {tags.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="inline-flex w-auto max-w-full cursor-pointer rounded text-sm leading-5 px-1 text-gray-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="italic mx-2" onClick={(e) => e.stopPropagation()}>
              no-tag-found
            </p>
          )}
        </div>
      </Menu>
    </Dropdown>
  );
};

export default TagSelector;
