import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import classNames from "classnames";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Icon from "../Icon";
import { archivePage } from "@/api/actions";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import useMemoStore from "@/store/memo";

interface Props {
    memoId: string;
    className?: string;
}

const MemoActionMenu = (props: Props) => {
    const { memoId } = props;
    const { toast } = useToast()
    const { removeMemo, insertMemo } = useMemoStore()
    const handleDeleteMemoClick = async () => {
        await archivePage(memoId, true);
        const index = removeMemo(memoId);
        toast({
            title: "已删除",
            description: "已将笔记归档",
            action: <ToastAction altText="撤回"
                onClick={async () => {
                    const memo = await archivePage(memoId, false)
                    if (memo) {
                        insertMemo(memo, index);
                    }
                    toast({
                        title: "已撤回",
                        description: "已将笔记撤回",
                    });
                }}
            >撤回</ToastAction>,
        })
    }
    return <DropdownMenu>
        <DropdownMenuTrigger>
            <span className={classNames("flex justify-center items-center rounded-full hover:opacity-70", props.className)}>
                <Icon.MoreVertical className="w-4 h-4 mx-auto text-gray-500 dark:text-gray-400" onClick={() => {
                    toast({
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                        action: <ToastAction altText="Try again">Try again</ToastAction>,
                    })
                }} />
            </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel className="cursor-pointer" onClick={handleDeleteMemoClick}>删除</DropdownMenuLabel>
        </DropdownMenuContent>
    </DropdownMenu>
};

export default MemoActionMenu;
