import { Client } from "@notionhq/client"

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})


const getData = async () => {
    const listUsersResponse = await notion.databases.query({
        database_id: "b3ac419be6f545f8b23aa11bb4ad3a8d",
    })
    return listUsersResponse
}

export {
    getData
}