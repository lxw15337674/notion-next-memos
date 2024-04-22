import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { extractTags } from ".";
import { Properties } from "@/type";


// 将字符串转换为notion的rich_text格式
export function convertTextToProperties(content: string): Properties {
    // 将字符串按换行符分割成数组
    const lines = content.split('\n');

    // 遍历每一行，创建对应的rich_text对象
    const richTextArray = lines.map((line) => ({
        type: 'text',
        text: {
            content: line,
        },
    }));

    // 提取标签
    const tags = extractTags(content)

    // 返回Notion Page Properties格式的对象
    return {
        content: {
            rich_text: richTextArray,
        },
        tags: {
            multi_select: tags.map((tag) => ({
                name: tag,
            })),
        },
    } 
}
