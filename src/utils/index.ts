export function separateTextAndTags(text: string): string[] {
    // Split the text based on spaces or tags (# followed by alphanumeric characters)
    const parts = text.split(/(\s+)|((?<!\S)#[a-zA-Z0-9]+)/g);

    // Filter out empty strings (which might occur due to leading/trailing spaces)
    return parts.filter(part => part);
}

// Example usage
// const text = "1#123 123";
// const separatedParts = separateTextAndTags(text);
// console.log(separatedParts); // Output: ["1", "#123", "123"]


export function convertGMTDateToLocal(gmtDateString:string) {
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