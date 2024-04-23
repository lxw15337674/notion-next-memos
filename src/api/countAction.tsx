'use server'
import { NotionAPI } from 'notion-client'

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!

const api = new NotionAPI({
    activeUser: process.env.NOTION_ACTIVE_USER,
    authToken: process.env.NOTION_TOKEN_V2

})

export async function getDBMeta() {
    const recordMap = await api.getPage(NOTION_DATABASE_ID,{
    })
    return recordMap
}