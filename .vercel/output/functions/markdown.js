export function markdownToHtml(markdown) {
    let html = "";
    // Split into lines for processing
    const lines = markdown.split("\n");
    let inList = false;
    let inOrderedList = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Check for headers
        if (line.startsWith("# ")) {
            if (inList) {
                html += "</ul>\n";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>\n";
                inOrderedList = false;
            }
            html += `<h1>${line.substring(2)}</h1>\n`;
        }
        else if (line.startsWith("## ")) {
            if (inList) {
                html += "</ul>\n";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>\n";
                inOrderedList = false;
            }
            html += `<h2>${line.substring(3)}</h2>\n`;
        }
        else if (line.startsWith("### ")) {
            if (inList) {
                html += "</ul>\n";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>\n";
                inOrderedList = false;
            }
            html += `<h3>${line.substring(4)}</h3>\n`;
        }
        // Check for list items with * or -
        else if (line.startsWith("* ") || line.startsWith("- ")) {
            if (inOrderedList) {
                html += "</ol>\n";
                inOrderedList = false;
            }
            if (!inList) {
                html += "<ul>\n";
                inList = true;
            }
            html += `  <li>${processInlineMarkdown(line.substring(2))}</li>\n`;
        }
        // Check for numbered list items
        else if (/^\d+\.\s/.test(line)) {
            if (inList) {
                html += "</ul>\n";
                inList = false;
            }
            if (!inOrderedList) {
                html += "<ol>\n";
                inOrderedList = true;
            }
            html += `  <li>${processInlineMarkdown(line.substring(line.indexOf(" ") + 1))}</li>\n`;
        }
        // Empty line or regular paragraph
        else {
            // End lists if necessary
            if (inList) {
                html += "</ul>\n";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>\n";
                inOrderedList = false;
            }
            // Handle empty lines as paragraph breaks
            if (line === "") {
                continue; // Skip empty lines
            }
            else {
                html += `<p>${processInlineMarkdown(line)}</p>\n`;
            }
        }
    }
    // Close any open lists at the end
    if (inList) {
        html += "</ul>\n";
    }
    if (inOrderedList) {
        html += "</ol>\n";
    }
    return html;
}
// Process inline markdown like bold, italic, etc.
function processInlineMarkdown(text) {
    // Handle bold
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Handle italic
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    return text;
}
