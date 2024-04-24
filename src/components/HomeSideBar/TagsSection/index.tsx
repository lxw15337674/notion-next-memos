import useTagStore from "@/store/tag";
import TagItemContainer from "./TagItemContainer";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


const TagsSection = () => {
    const { tags } = useTagStore();
    if (!tags.length) {
        return null;
    }

    return (
        <Card className="flex flex-1 flex-col justify-start items-start w-full mt-3  h-auto shrink-0 flex-nowrap py-2 px-3 rounded-md space-y-0.5 overflow-hidden">
            <div className="flex flex-row justify-start items-center w-full">
                <span className="text-sm leading-6 font-mono text-gray-400 select-none">
                    标签
                </span>
            </div>
            <ScrollArea className="w-full ">
                {tags.map((t) => (
                    <TagItemContainer key={t.id} tag={t} />
                ))}
            </ScrollArea>
        </Card>
    );
};

export default TagsSection;
