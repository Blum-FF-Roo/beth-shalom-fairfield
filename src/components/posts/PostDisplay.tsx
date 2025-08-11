"use client";

import { Post } from "@/types";
import ShareButton from "@/components/ui/ShareButton";

interface PostDisplayProps {
  post: Post;
}

export default function PostDisplay({ post }: PostDisplayProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-orange-400 pl-4 italic text-gray-600 my-4">$1</blockquote>',
      )
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(
        /(<li[\s\S]*?<\/li>)/g,
        '<ul class="list-disc pl-6 space-y-1 my-4">$1</ul>',
      )
      .split("\n\n")
      .map((paragraph) =>
        paragraph.trim() ? `<p class="mb-4">${paragraph}</p>` : "",
      )
      .join("")
      .replace(/<p class="mb-4">(<ul|<blockquote)/g, "$1")
      .replace(/(<\/ul>|<\/blockquote>)<\/p>/g, "$1");
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="text-sm text-gray-500">
          Published on {formatDate(post.createdAt)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
      </div>

      {/* <div className="flex items-center justify-between mb-4"> */}
        {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ */}
        {/*   post.category === 'parshah'  */}
        {/*     ? 'bg-blue-100 text-blue-800'  */}
        {/*     : 'bg-purple-100 text-purple-800' */}
        {/* }`}> */}
        {/*   {post.category === 'parshah' ? 'Parshah' : 'High Holy Day'} */}
        {/* </span> */}

      {/*   <ShareButton title={post.title} /> */}
      {/* </div> */}
      {/* Footer */}
      <div className="bg-gray-50 px-6 sm:px-8 py-4">
      {/*   <div className="flex items-center justify-between"> */}
      {/*     <div className="text-sm text-gray-500"> */}
      {/*       Last updated: {formatDate(post.updatedAt)} */}
      {/*     </div> */}
      {/*      */}
          <ShareButton 
            title={post.title}
            className="text-xs"
          />
      {/*   </div> */}
      </div>
    </article>
  );
}
