'use client';

import { useState } from 'react';
import { Bold, Italic, List, Quote } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your post content here..." }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = before + selectedText + after;
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="list-disc pl-6">$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<ul|<\/ul|<blockquote|<\/blockquote)/g, '$1')
      .replace(/(<\/ul>|<\/blockquote>)<\/p>/g, '$1');
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            title="List"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isPreview 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 min-h-96 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatPreview(value) }}
          />
        ) : (
          <textarea
            id="content-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-96 p-4 border-0 resize-none focus:outline-none focus:ring-0"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace' }}
          />
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 border-t border-gray-300 px-3 py-2 text-xs text-gray-500">
        Supports Markdown: **bold**, *italic*, &gt; quotes, - lists
      </div>
    </div>
  );
}