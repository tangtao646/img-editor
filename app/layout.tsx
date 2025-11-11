// app/layout.tsx

import './globals.css'; 
import type { Metadata } from 'next';


export const metadata: Metadata = {
  // 设置网站标题
  title: 'Image Edit Toolkit',
  // 设置网站描述
  description: 'A tool for batch resizing and WebP conversion locally in the browser',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 确保设置语言为中文
    <html lang="zh-CN"> 
      {/* 在 body 标签上设置默认的背景颜色和字体 */}
      <body className={`min-h-screen antialiased`}> 
        {children}
      </body>
    </html>
  );
}