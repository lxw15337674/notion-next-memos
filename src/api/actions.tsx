'use server'
import { Client } from "@notionhq/client"
import { CreatePageParameters, DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { convertTextToProperties } from "@/utils/converter"
import { Tag } from "@/type"

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!
const ClientNotion = new Client({
    auth: process.env.NOTION_TOKEN,
})


export const getDBData = async () => {
    const listUsersResponse = await ClientNotion.databases.query({
        database_id: NOTION_DATABASE_ID,
        sorts: [
            {
                timestamp: "created_time",
                direction: "descending"
            }
        ],
        // page_size: 100
    })
    return listUsersResponse.results as DatabaseObjectResponse[]
}

// export const getDBDataCount = async () => {
//     const listUsersResponse = await ClientNotion.databases.query({
//         database_id: NOTION_DATABASE_ID,
//         filter: {
//             property: "labels",
//             multi_select: {
//                 contains: "count"
//             }
//         }
//     })
//     return listUsersResponse.results as DatabaseObjectResponse[]
// }




// 添加新页面到数据库
export async function createPageInDatabase(content: string) {
    try {
        // 定义新页面的属性
        const newPageData: CreatePageParameters = {
            parent: { database_id: NOTION_DATABASE_ID },
            properties: convertTextToProperties(content) as Record<string, any>
        };
        // 创建新页面
        await ClientNotion.pages.create(newPageData);
    } catch (error) {
        console.error("Error creating page:", error);
    }
}

// 删除特定页面
async function archivePage(pageId: string) {
    try {
        await ClientNotion.pages.update({
            page_id: pageId,
            archived: true,
        });
        console.log(`页面 ${pageId} 已成功存档。`);
    } catch (error) {
        console.error("存档页面时出错：", error);
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
//         console.log(`Page with ID ${pageId} updated.`);
//     } catch (error) {
//         console.error("Error updating page:", error);
//     }
// }

// 获取所有标签
export async function getAllLabels() {
    const listUsersResponse = await ClientNotion.databases.retrieve({
        database_id: NOTION_DATABASE_ID,
    })
    return (listUsersResponse.properties.labels as any).multi_select .options as Tag[]
}
