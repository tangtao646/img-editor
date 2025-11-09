// app/layout.tsx

import './globals.css'; 
import type { Metadata } from 'next';

// 假设您想使用 Google Fonts，例如 Inter
// import { Inter } from 'next/font/google'; 
// const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  // 设置网站标题
  title: '本地批量图片工具',
  // 设置网站描述
  description: '在浏览器本地进行批量调整尺寸和 WebP 格式转换的工具',
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