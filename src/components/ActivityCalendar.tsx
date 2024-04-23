import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";
import { Card } from "./ui/card";


const ActivityCalendar: React.FC = () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
        <Card className="  mt-4 w-full ">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
            />
        </Card>

    )

};

export default ActivityCalendar;