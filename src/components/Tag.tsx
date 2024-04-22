import useFilterStore from "@/store/filter";
import useMemoStore from "@/store/memo";

interface Props {
    text: string;
    className?: string;
}

const Tag = ({ text, className }: Props) => {
    const { setFilter } = useFilterStore()
    return (
        <span
            onClick={() => {
                setFilter([text])
            
            }}
            className={`cursor-pointer ${className}`}
        >
            {text}
        </span>
    );
};

export default Tag;
