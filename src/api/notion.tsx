import { Client } from "@notionhq/client"
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints"

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})


const getData = async () => {
    const listUsersResponse = await notion.databases.query({
        database_id: "c7b7f98dfe8e43a6bc7454c9e17e03b7",
        sorts: [
            {
                timestamp: "created_time" ,
                direction: "ascending"
            }
        ]
    })
    return listUsersResponse.results as DatabaseObjectResponse[]
}

export {
    getData
}