export function markdownToHtml(markdown: string): string {
  let html = "";

  // Split into lines for processing
  const lines = markdown.split("\n");

  let inList = false;
  let inOrderedList = false;

  // Store reference links
  const referenceLinks: Record<string, { url: string; title?: string }> = {};

  // First pass to collect reference links
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Check for reference link definitions [id]: url "optional title"
    const refLinkMatch = line.match(/^\[(.*?)\]:\s*(\S+)(?:\s+"(.*?)")?$/);
    if (refLinkMatch) {
      const [, id, url, title] = refLinkMatch;
      referenceLinks[id.toLowerCase()] = { url, title };
      // Remove this line from processing
      lines[i] = "";
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip lines that were reference link definitions
    if (line === "") {
      // End lists if necessary
      if (inList) {
        html += "</ul>\n";
        inList = false;
      }
      if (inOrderedList) {
        html += "</ol>\n";
        inOrderedList = false;
      }
      continue;
    }

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
      html += `<h1>${processInlineMarkdown(
        line.substring(2),
        referenceLinks
      )}</h1>\n`;
    } else if (line.startsWith("## ")) {
      if (inList) {
        html += "</ul>\n";
        inList = false;
      }
      if (inOrderedList) {
        html += "</ol>\n";
        inOrderedList = false;
      }
      html += `<h2>${processInlineMarkdown(
        line.substring(3),
        referenceLinks
      )}</h2>\n`;
    } else if (line.startsWith("### ")) {
      if (inList) {
        html += "</ul>\n";
        inList = false;
      }
      if (inOrderedList) {
        html += "</ol>\n";
        inOrderedList = false;
      }
      html += `<h3>${processInlineMarkdown(
        line.substring(4),
        referenceLinks
      )}</h3>\n`;
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
      html += `  <li>${processInlineMarkdown(
        line.substring(2),
        referenceLinks
      )}</li>\n`;
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
      html += `  <li>${processInlineMarkdown(
        line.substring(line.indexOf(" ") + 1),
        referenceLinks
      )}</li>\n`;
    }
    // Regular paragraph
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

      html += `<p>${processInlineMarkdown(line, referenceLinks)}</p>\n`;
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

// Process inline markdown like bold, italic, links, etc.
function processInlineMarkdown(
  text: string,
  referenceLinks: Record<string, { url: string; title?: string }>
): string {
  // Handle inline links [text](url "optional title")
  text = text.replace(
    /\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g,
    (match, linkText, url, title) => {
      if (title) {
        return `<a href="${url}" title="${title}">${linkText}</a>`;
      }
      return `<a href="${url}">${linkText}</a>`;
    }
  );

  // Handle reference links [text][id] or [text][] (implicit links, where id = text)
  text = text.replace(/\[(.*?)\](?:\[(.*?)\])?/g, (match, linkText, id) => {
    // If no id is specified, use linkText as the id
    const refId = id === undefined || id === "" ? linkText : id;

    // Look up the reference
    const reference = referenceLinks[refId.toLowerCase()];

    // If reference exists, create a link
    if (reference) {
      if (reference.title) {
        return `<a href="${reference.url}" title="${reference.title}">${linkText}</a>`;
      }
      return `<a href="${reference.url}">${linkText}</a>`;
    }

    // If no reference is found, return the original text
    return match;
  });

  // Handle bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Handle italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  return text;
}
