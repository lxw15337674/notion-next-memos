'use server'
import { Client } from "@notionhq/client"
import { CreatePageParameters, CreatePageResponse, DatabaseObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { convertTextToProperties } from "@/utils/converter"
import { TagType } from "@/type"
import useMemoStore from "@/store/memo"

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!
const ClientNotion = new Client({
    auth: process.env.NOTION_TOKEN,
})


export const getDBData = async (config: {
    startCursor?: string;
    pageSize?: number;
    filter?: any
}) => {
    const {
        startCursor = undefined,
        pageSize = 20,
        filter
    } = config
    const listUsersResponse = await ClientNotion.databases.query({
        database_id: NOTION_DATABASE_ID,
        sorts: [
            {
                timestamp: "created_time",
                direction: "descending",
            },
        ],
        page_size: pageSize,
        start_cursor: startCursor,
        filter,
    });
    return listUsersResponse;
};

// export const getDBDataCount = async () => {
//     const listUsersResponse = await ClientNotion.databases.query({
//         database_id: NOTION_DATABASE_ID,
//         filter: {
//             property: "tags",
//             multi_select: {
//                 contains: "count"
//             }
//         }
//     })
//     return listUsersResponse.results as DatabaseObjectResponse[]
// }


// 添加新页面到数据库
export async function createPageInDatabase(content: string) {
    // 定义新页面的属性
    const newPageData: CreatePageParameters = {
        parent: { database_id: NOTION_DATABASE_ID },
        properties: convertTextToProperties(content) as Record<string, any>
    };
    // 创建新页面
    return await ClientNotion.pages.create(newPageData) as unknown as DatabaseObjectResponse

}

// 删除特定页面
export async function archivePage(pageId: string, archived: boolean) {
    try {
        return await ClientNotion.pages.update({
            page_id: pageId,
            archived,
        }) as unknown as DatabaseObjectResponse
    } catch (error) {
        console.error(error);
    }
}

// 更新页面的属性
// async function updatePageProperties(pageId:string) {
//     try {
//         const newTitle = "Updated Page Title";
//         // 更新页面的名称属性
//         const response = await notion.pages.update({
//             page_id: pageId,
//             properties: {
//                 Name: {
//                     id: "name_property_id", // 替换为实际的属性ID
//                     type: "title",
//                     title: [
//                         {
//                             text: {
//                                 content: newTitle,
//                             },
//                         },
//                     ],
//                 },
//             },
//         });
//         
//     } catch (error) {
//         
//     }
// }

// 获取所有标签
export async function getAllLabels() {
    const listUsersResponse = await ClientNotion.databases.retrieve({
        database_id: NOTION_DATABASE_ID,
    })
    return (listUsersResponse.properties.tags as any)?.multi_select?.options as TagType[]
}
