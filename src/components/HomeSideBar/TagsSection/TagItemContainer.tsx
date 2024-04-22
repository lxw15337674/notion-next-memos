import useTagStore from "@/store/tag";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import Icon from "../../Icon";
import { TagType } from "@/type";
import Tag from "@/components/Tag";

interface Props {
    tag: TagType
}

export const TagItemContainer = ({ tag }: Props) => {
    // const isActive = tagQuery === tag.text;
    // const hasSubTags = tag.subTags.length > 0;

    const handleTagClick = () => {
        // if (isActive) {
        //     filterStore.setTagFilter(undefined);
        // } else {
        //     filterStore.setTagFilter(tag.text);
        // }
    };

    const handleToggleBtnClick = (event: React.MouseEvent) => {
    };

    const handleDeleteTag = async () => {

    };

    return (
        <>
            <div className="relative flex flex-row justify-between items-center w-full leading-6 py-0 mt-px rounded-lg text-sm select-none shrink-0">
                <div
                    className={`flex flex-row justify-start items-center truncate shrink leading-5 mr-1 text-gray-600 dark:text-gray-400 
                        }`}
                >
                    <Dropdown>
                        <MenuButton slots={{ root: "div" }}>
                            <div className="shrink-0 group">
                                <Icon.Hash className="group-hover:hidden w-4 h-auto shrink-0 opacity-60 mr-1" />
                                <Icon.MoreVertical className="hidden group-hover:block w-4 h-auto shrink-0 opacity-60 mr-1" />
                            </div>
                        </MenuButton>
                        <Menu size="sm" placement="bottom">
                            {/* <MenuItem  >
                                <Icon.Edit3 className="w-4 h-auto" />
                                {t("common.rename")}
                            </MenuItem>
                            <MenuItem color="danger" onClick={handleDeleteTag}>
                                <Icon.Trash className="w-4 h-auto" />
                                {t("common.delete")}
                            </MenuItem> */}
                        </Menu>
                    </Dropdown>
                    <Tag className="truncate cursor-pointer hover:opacity-80" text={tag.name} />
                </div>
            </div>
        </>
    );
};

export default TagItemContainer;
