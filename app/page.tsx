// app/page.tsx
"use client";

import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import { ProcessSettings, defaultSettings } from './components/ProcessSettings';
import ProcessingFlow from './components/ProcessingFlow';
import { ToolSettings } from './lib/types';

export default function HomePage() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState<ToolSettings>(defaultSettings);

    const fileCount = uploadedFiles.length;

    return (
        // 整体背景使用柔和的浅色，移除原有的整体 padding
        <div className="min-h-screen bg-gray-50"> 
            
            {/* --- 新增：导航栏 (Header) --- */}
            <header className="w-full bg-white shadow-lg sticky top-0 z-50 py-4 px-4 md:px-10 border-b border-gray-200">
                <div className="max-w-8xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {/* Logo / 标题 - 使用应用名称或简化名称 */}
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                            Image Optimizer Pro
                        </span>
                        <span className="hidden sm:block text-sm text-gray-500">| 本地批量图片处理工具</span>
                    </div>
                    {/* 右侧导航项 (可选) */}
                    <nav className="space-x-6 text-gray-600 font-medium hidden md:flex">
                        {/* 占位链接 */}
                        <a href="#" className="hover:text-indigo-600 transition-colors">关于我们</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">捐赠赞助</a>
                    </nav>
                </div>
            </header>

            {/* --- 主内容区域：应用 padding --- */}
            {/* 这里的 padding 确保内容与导航栏之间有空间 */}
            <div className="p-4 md:p-10 pt-4 md:pt-6"> 
                {/* --- 核心三列网格布局 (Desktop/XL+) --- */}
                {/* 布局：[左侧广告 (100px)] [主内容] [右侧广告 (100px)] */}
                <div className="grid grid-cols-1 xl:grid-cols-[100px_minmax(0,_1fr)_100px] gap-8 justify-center max-w-8xl mx-auto">
                    
                    {/* --- 广告位 D: 左侧摩天大楼 (Skyscraper) --- */}
                    {/* sticky top-10 确保广告位于粘性导航栏下方 */}
                    <div className="hidden xl:block sticky top-10 h-min">
                        <div 
                            className="bg-gray-100 text-gray-500 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-sm font-mono p-1"
                            // 宽度保持 100px
                            style={{ width: '100px', height: '600px', fontSize: '10px' }}
                        >
                            [广告 D: 左侧 (100x600)]
                        </div>
                    </div>

                    {/* --- 主内容列 (居中) --- */}
                    <div className="flex flex-col items-center w-full">
                        {/* 主容器：更大、圆角、更深的阴影 */}
                        <main className="w-full max-w-5xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl transition-all duration-300 transform hover:shadow-3xl">

                            {/* 主页面标题 - 与导航栏 Logo 分开 */}
                            <h1 className="text-4xl md:text-4xl font-black mb-6 text-center tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                                    ✨ 批量图片处理流程
                                </span>
                            </h1>
                            <p className="text-center text-gray-500 mb-8">轻松实现图片格式转换、尺寸调整和文件大小优化。</p>


                            {/* --- 广告位 A: 头部横幅 (Leaderboard) --- (保持原位，防止 CLS) */}
                            <div id="ad-top-leaderboard" className="w-full mb-8 flex justify-center">
                                <div 
                                    className="bg-gray-100 text-gray-500 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-xs font-mono"
                                    style={{ minHeight: '90px', width: '100%', maxWidth: '728px' }}
                                >
                                    [广告位 A: 头部横幅 (728x90 / 响应式)]
                                </div>
                            </div>

                            {/* 1. 上传 - 突出显示区域 */}
                            <div className="border border-dashed border-gray-300 p-6 rounded-2xl bg-indigo-50/50 mb-12">
                                <h2 className="text-2xl font-extrabold mb-5 text-indigo-700 flex items-center">
                                    <span className="mr-3">1. 上传图片</span>
                                </h2>
                                <ImageUploader onFilesSelected={setUploadedFiles} />
                            </div>

                            {/* 2. 配置与 3. 执行 (上传文件后显示) */}
                            {fileCount > 0 ? (
                                <>
                                    {/* 🚀 修正：将 H2 标题和文件计数器并排放置 */}
                    
                                    
                                    <ProcessSettings settings={settings} onSettingsChange={setSettings} />
                                    
                                    <ProcessingFlow 
                                        files={uploadedFiles} 
                                        settings={settings} 
                                    />
                                </>
                            ) : (
                                /* 占位符（未上传文件时显示） */
                                <div className="mt-20 text-center text-gray-400 p-10 border-2 border-dashed border-gray-200 rounded-xl">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <p className="text-xl font-semibold">
                                        拖放图片或点击上传，开始您的优化之旅。
                                    </p>
                                </div>
                            )}

                        </main>
                        
                        {/* 页脚 - 保持在主内容下方居中 */}
                        <footer className="mt-8 text-gray-500 text-sm text-center">
                            由 Gemini 提供支持 | 所有处理均在您的浏览器本地完成
                        </footer>
                    </div>
                    
                    {/* --- 广告位 E: 右侧摩天大楼 (Skyscraper) --- */}
                    <div className="hidden xl:block sticky top-10 h-min">
                        <div 
                            className="bg-gray-100 text-gray-500 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-sm font-mono p-1"
                            // 宽度保持 100px
                            style={{ width: '100px', height: '600px', fontSize: '10px' }}
                        >
                            [广告 E: 右侧 (100x600)]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}