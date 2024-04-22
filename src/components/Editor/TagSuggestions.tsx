import { useEffect, useRef, useState } from "react";
import useTagStore from "@/store/tag";
import OverflowTip from "../OverflowTip";
import classNames from "classnames";
import useEditorStore from "@/store/editor";
import getCaretCoordinates from "textarea-caret";


type Position = { left: number; top: number; height: number };

const TagSuggestions = () => {
  const { editorRef, insertText } = useEditorStore()
  const [position, setPosition] = useState<Position | null>(null);
  const tagStore = useTagStore();
  const tagsRef = useRef(Array.from(tagStore.tags));
  tagsRef.current = Array.from(tagStore.tags);

  const [selected, select] = useState(0);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const hide = () => setPosition(null);

  const getCurrentWord = (): [word: string, startIndex: number] => {
    const editor = editorRef.current;
    if (!editor) return ["", 0];
    const cursorPos = editor.selectionEnd;
    const before = editor.value.slice(0, cursorPos).match(/\S*$/) || { 0: "", index: cursorPos };
    const after = editor.value.slice(cursorPos).match(/^\S*/) || { 0: "" };
    return [before[0] + after[0], before.index ?? cursorPos];
  };

  const suggestionsRef = useRef<string[]>([]);
  suggestionsRef.current = (() => {
    const search = getCurrentWord()[0].slice(1).toLowerCase();
    return tagsRef.current.filter((tag) => tag.name.toLowerCase().includes(search)).map((tag) => tag.name);
  })();

  const isVisibleRef = useRef(false);
  isVisibleRef.current = !!(position && suggestionsRef.current.length > 0);

  const autocomplete = (tag: string) => {
    const [word] = getCurrentWord();
    insertText(tag.slice(word.length - 1), 1);
    hide();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isVisibleRef.current) return;
    const suggestions = suggestionsRef.current;
    const selected = selectedRef.current;
    if (["Escape", "ArrowLeft", "ArrowRight"].includes(e.code)) hide();
    if ("ArrowDown" === e.code) {
      select((selected + 1) % suggestions.length);
      e.preventDefault();
      e.stopPropagation();
    }
    if ("ArrowUp" === e.code) {
      select((selected - 1 + suggestions.length) % suggestions.length);
      e.preventDefault();
      e.stopPropagation();
    }
    if (["Enter", "Tab"].includes(e.code)) {
      autocomplete(suggestions[selected]);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleInput = () => {
    const editor = editorRef.current;
    if (!editor) return;
    select(0);
    const [word, index] = getCurrentWord();
    const currentChar = editor.value[editor.selectionEnd];
    const isActive = word.startsWith("#") && currentChar !== "#";
    const caretCordinates = getCaretCoordinates(editor, index);
    caretCordinates.left += 20
    isActive ? setPosition(caretCordinates) : hide();
  };

  const listenersAreRegisteredRef = useRef(false);
  const registerListeners = () => {
    const editor = editorRef.current;
    if (!editor || listenersAreRegisteredRef.current) return;
    editor.addEventListener("click", hide);
    editor.addEventListener("blur", hide);
    editor.addEventListener("keydown", handleKeyDown);
    editor.addEventListener("input", handleInput);
    listenersAreRegisteredRef.current = true;
  };
  useEffect(registerListeners, [!!editorRef.current]);

  if (!isVisibleRef.current || !position) return null;
  return (
    <div
      className="z-20 p-1 mt-1 -ml-2 absolute max-w-[12rem] gap-px rounded font-mono flex flex-col justify-start items-start overflow-auto shadow bg-zinc-100 dark:bg-zinc-700"
      style={{ left: position.left, top: position.top + position.height }}
    >
      {suggestionsRef.current.map((tag, i) => (
        <div
          key={tag}
          onMouseDown={() => autocomplete(tag)}
          className={classNames(
            "rounded p-1 px-2 w-full truncate text-sm dark:text-gray-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800",
            i === selected ? "bg-zinc-300 dark:bg-zinc-600" : "",
          )}
        >
          <OverflowTip>{tag}</OverflowTip>
        </div>
      ))}
    </div>
  );
};

export default TagSuggestions;
