import React from "react";
import showdown from "showdown";

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  // 创建 Showdown 转换器实例
  const converter = new showdown.Converter();

  // 将 Markdown 转换为 HTML
  const html = converter.makeHtml(markdown);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
