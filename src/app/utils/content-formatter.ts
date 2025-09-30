/**
 * Content formatting utility for rendering HTML content safely across the application
 * Handles both Markdown-style formatting and basic HTML tags with sanitization
 */

/**
 * Minimal sanitization to prevent only the most dangerous XSS attacks
 * Allows all HTML tags but removes scripts and event handlers
 */
function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  // Remove event handlers (onclick, onload, etc.)
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '');
  
  // Remove javascript: URLs
  html = html.replace(/javascript:/gi, '');
  
  return html;
}

/**
 * Format content with Markdown-style syntax and HTML support
 * Based on the working formatContent function from PostDisplay.tsx
 */
export function formatContentAsHtml(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // First, handle Markdown-style formatting
  let formattedContent = content
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic text: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Blockquotes: > text -> <blockquote>text</blockquote>
    .replace(
      /^> (.*$)/gm,
      '<blockquote class="border-l-4 border-orange-400 pl-4 italic text-gray-600 my-4">$1</blockquote>',
    )
    // List items: - text -> <li>text</li>
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    // Wrap consecutive list items in <ul>
    .replace(
      /(<li[\s\S]*?<\/li>)/g,
      '<ul class="list-disc pl-6 space-y-1 my-4">$1</ul>',
    );

  // Handle paragraphs - split by double newlines and wrap in <p> tags
  formattedContent = formattedContent
    .split("\n\n")
    .map((paragraph) =>
      paragraph.trim() ? `<p class="mb-4">${paragraph}</p>` : "",
    )
    .join("")
    // Clean up paragraph tags around block elements
    .replace(/<p class="mb-4">(<ul|<blockquote)/g, "$1")
    .replace(/(<\/ul>|<\/blockquote>)<\/p>/g, "$1");

  // Sanitize the final HTML
  return sanitizeHtml(formattedContent);
}

/**
 * Simple plain text formatter for cases where HTML is not desired
 * Preserves line breaks and basic structure
 */
export function formatContentAsPlainText(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return content
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
    .replace(/\*(.*?)\*/g, "$1")     // Remove italic markdown
    .replace(/^> /gm, "")            // Remove blockquote markers
    .replace(/^- /gm, "• ")          // Convert list markers to bullets
    .trim();
}

/**
 * Check if content contains HTML tags
 */
export function containsHtml(content: string): boolean {
  return /<[^>]*>/g.test(content);
}

/**
 * Get a plain text excerpt from formatted content
 * Useful for previews or meta descriptions
 */
export function getContentExcerpt(content: string, maxLength: number = 160): string {
  const plainText = formatContentAsPlainText(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}