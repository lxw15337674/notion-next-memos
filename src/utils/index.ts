interface Content {
    text: string;
    type: 'text' | 'tag'
}
export function parseContent(text: string): Content[] {
    const res: Content[] = [];
    let buffer = '';
    let isTag = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Check for '#' character to start a tag
        if (char === '#' && !isTag) {
            if (buffer.length > 0) {
                res.push({ text: buffer, type: 'text' });
            }
            buffer = '#';
            isTag = true; // We are now inside a tag
        }
        // Check for ' ' to end a tag
        else if (char === ' ' && isTag) {
            res.push({ text: buffer, type: 'tag' });
            buffer = ' ';
            isTag = false; // We are now outside a tag
        }
        // Append other characters to buffer
        else {
            buffer += char;
        }
    }

    // Push the last buffer content if it's not empty
    if (buffer.length > 0) {
        if (buffer.split('').every(item => item === '#')) {
            isTag = false
        }
        res.push({ text: buffer, type: isTag ? 'tag' : 'text' });
    }

    return res;
}

export function extractTags(text: string): string[] {
    // 使用正则表达式匹配标签（#开头，后跟字母数字字符）
    const labelRegex = /#[a-zA-Z0-9\u4e00-\u9fa5]+/g;
    const tags = text.match(labelRegex)?.map(label => label.slice(1))

    // 如果找到标签，则返回标签数组，否则返回空数组
    return tags ? tags : [];
}

export function convertGMTDateToLocal(gmtDateString: string) {
    // Parse the GMT date string
    const gmtDate = new Date(gmtDateString);

    // Get the local date and time components
    const year = gmtDate.getFullYear();
    const month = (gmtDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month (0-indexed)
    const day = gmtDate.getDate().toString().padStart(2, '0');
    const hours = gmtDate.getHours().toString().padStart(2, '0');
    const minutes = gmtDate.getMinutes().toString().padStart(2, '0');
    const seconds = gmtDate.getSeconds().toString().padStart(2, '0');

    // Create the local datetime string
    const localDatetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return localDatetimeString;
}

// // Example usage:
// const gmtDateString = "Thu, 18 Apr 2024 08:06:00 GMT";
// const localDatetimeString = convertGMTDateToLocal(gmtDateString);
// console.log(localDatetimeString); // Output (example): "2024-04-17 17:22:59"