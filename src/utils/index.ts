interface Content {
    text: string;
    type: 'text' | 'tag'
}
export function parseContent(text: string): Content[] {
    const res: Content[] = [];
    let pre = '';
    let flag = false;
    for (let char of text) {
        if (char === '#') {
            if (pre.length) {
                res.push({
                    text: pre,
                    type: flag ? 'tag' : 'text'
                })
            }
            pre = ''
            flag = true;
        }
        if (char === ' ' && flag) {
            flag = false
            if (pre !== '#') {
                res.push({
                    text: pre,
                    type: 'tag'
                });
                pre = '';
            }
        }
        pre += char
    }

    if (pre !== '') {
        res.push({
            text: pre,
            type: flag ? 'tag' : 'text'
        });
    }

    return res;
}
// Example usage
// const text = "1#123 123";
// const separatedParts = separateTextAndLabels(text);
// console.log(separatedParts); // Output: ["1", "#123", "123"]


export function extractLabels(text: string): string[] {
    // 使用正则表达式匹配标签（#开头，后跟字母数字字符）
    const labelRegex = /#[a-zA-Z0-9\u4e00-\u9fa5]+/g;
    const labels = text.match(labelRegex)?.map(label => label.slice(1))

    // 如果找到标签，则返回标签数组，否则返回空数组
    return labels ? labels : [];
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