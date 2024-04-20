import useTagStore from "@/store/tag";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import Icon from "../../Icon";
import TagItemContainer from "./TagItemContainer";


const TagsSection = () => {
    const { tags } = useTagStore();
    if (!tags.length) {
        return null;
    }

    return (
        <div className="flex flex-col justify-start items-start w-full mt-3 px-1 h-auto shrink-0 flex-nowrap hide-scrollbar">
            <div className="flex flex-row justify-start items-center w-full">
                <span className="text-sm leading-6 font-mono text-gray-400 select-none">
                    标签
                </span>
            </div>
            <div className="flex flex-col justify-start items-start relative w-full h-auto flex-nowrap gap-2 mt-1">
                {tags.map((t) => (
                    <TagItemContainer key={t.id} tag={t} />
                ))}
            </div>
        </div>
    );
};

export default TagsSection;
