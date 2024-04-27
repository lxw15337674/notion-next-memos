"use client";
import { format, getUnixTime } from 'date-fns';
interface Props {
    text: string[];
}

const DrawDefaultPreview = (props: Props) => {
    const { text } = props;
    const image = "https://source.unsplash.com/random/1080?wallpapers";
    return (
        <div
            className="relative aspect-[3/4] w-96 overflow-hidden bg-black">
            <div
                id="draw-share-card-bg"
                className="absolute left-0 right-0 top-0 aspect-[3/4] h-full backdrop-blur-none"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                }}
            />
            <div
                className="absolute left-0 right-0 top-0 h-full opacity-60 backdrop-blur-none"
                style={{ backgroundColor: "#1F2937" }}
            />
            <div className="relative h-full w-full p-4">
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                    <div className="w-full space-y-2 text-center text-2xl ">
                        {text.map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 opacity-70 text-base">
                    <div> ✍️ Bhwa233</div>
                    <div> 🕛 {format(new Date(), 'yyyy-MM-dd')}</div>
                </div>

            </div>
        </div>
    );
};

export default DrawDefaultPreview;
