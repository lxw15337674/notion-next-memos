import { Properties } from '@/type';

interface Content {
  text: string;
  type: 'text' | 'tag';
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
    if (buffer.split('').every((item) => item === '#')) {
      isTag = false;
    }
    res.push({ text: buffer, type: isTag ? 'tag' : 'text' });
  }

  return res;
}

export function extractTags(text: string): string[] {
  // 使用正则表达式匹配标签（#开头，后跟字母数字字符）
  const labelRegex = /#[a-zA-Z0-9\u4e00-\u9fa5]+/g;
  const tags = text.match(labelRegex)?.map((label) => label.slice(1));

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


// 合并模式：标签和文本合并在一起。
export function mergedMode(content: string): Properties {
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
  const tags = extractTags(content);

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
  };
}

// 拆分模式：标签和文本分开。
export function splitMode(content: string): Properties {
  // 将字符串按换行符分割成数组
  const lines = content.split('\n');
  const tags: string[] = []
  let text = ''
  lines.forEach((line) => {
    const content = parseContent(line)
    for (const item of content) {
      if (item.type === 'tag') {
        tags.push(item.text.slice(1))
      } else {
        text += item.text
      }
    }
    text += '\n'
  })
  text = text.slice(0, -1)
  return {
    content: {
      rich_text: [{
        type: 'text',
        text: {
          content: text,
        },
      }],
    },
    tags: {
      multi_select: tags.map((tag) => ({
        name: tag,
      })),
    },
  };
} 
