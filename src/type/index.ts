export interface Properties{
    content: {
        rich_text: {
            type: string;
            text: {
                content: string;
            };
        }[];
    };
    labels:{
        multi_select: {
            name: string;
        }[];
    };
}


export interface Tag {
    id: string;
    name: string;
    color: string;
    description: string;
}