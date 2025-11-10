import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 关键配置：启用静态导出 (Static Export)
  // 这会告诉 Next.js 在构建时生成一个 'out' 目录，包含纯静态的 HTML 文件。
  output: 'export',

  // 2. (可选) 禁用图片优化，因为 Pages 无法进行运行时优化
  // 如果您的项目中使用了 Next.js Image Component，需要禁用此项。
  images: {
    unoptimized: true, 
  },

  // 您现有的配置...
  // /* config options here */
};

export default nextConfig;