// app/components/ProcessingFlow.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation, Language } from '../lib/i18n';
import { ToolSettings, ProcessedFile } from '../lib/types';
import { processImage, loadImage } from '../lib/imageProcessor';
import { batchDownload } from '../lib/batchDownloader';

interface ProcessingFlowProps {
    files: File[];
    settings: ToolSettings;
}

// 辅助函数：格式化字节大小为可读的 MB/KB
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function ProcessingFlow({ files, settings }: ProcessingFlowProps) {
    const { t, tf } = useTranslation();
    const [processedList, setProcessedList] = useState<ProcessedFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    // 状态：用于控制哪个文件的预览处于展开状态
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    // 初始化/重置处理列表 (添加了 originalDimensions)
    useEffect(() => {
        // 1. 初始化列表结构 (同步操作)
        const initialList: ProcessedFile[] = files.map(file => ({
            id: file.name,
            originalFile: file,
            status: 'pending' as 'pending',
            originalSize: file.size,
            processedSize: 0,
            processedMimeType: '',
            outputFileName: '',
            downloadUrl: '',
            file: file,
            originalDimensions: { width: 0, height: 0 }, // 初始占位符
            processedDimensions: { width: 0, height: 0 }
        }));
        setProcessedList(initialList);
        setProgress(0);
        setExpandedId(null);

        // 2. 定义异步加载函数
        const loadDimensions = async () => {
            // 为每个文件创建加载尺寸的 Promise
            const dimensionPromises = files.map(async (file, index) => {
                try {
                    // 调用 imageProcessor 中的 loadImage 辅助函数
                    const img = await loadImage(file);
                    return { index, width: img.width, height: img.height };
                } catch (error) {
                    // 加载失败，返回 0
                    return { index, width: 0, height: 0 };
                }
            });

            // 批量等待所有 Promise 完成
            const results = await Promise.allSettled(dimensionPromises);

            // 3. 安全地更新状态
            setProcessedList(currentList => {
                const updatedList = [...currentList];

                results.forEach(result => {
                    // 仅处理成功的 Promise
                    if (result.status === 'fulfilled' && result.value.width > 0) {
                        const { index, width, height } = result.value;
                        if (updatedList[index]) {
                            // 更新原始尺寸
                            updatedList[index] = {
                                ...updatedList[index],
                                originalDimensions: { width, height }
                            };
                        }
                    }
                });
                return updatedList;
            });
        };

        // 仅在有文件时启动加载
        if (files.length > 0) {
            loadDimensions();
        }

    }, [files]); // 依赖文件列表

    // --- 批量处理函数 ---
    const startProcessing = useCallback(async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        let completedCount = 0;

        // 重置状态为 pending 
        const pendingList = processedList.map(item => ({
            ...item,
            status: 'pending' as 'pending',
            errorMessage: undefined
        })) as ProcessedFile[];
        setProcessedList(pendingList);

        const newProcessedList: ProcessedFile[] = [...pendingList];

        for (const [index, item] of pendingList.entries()) {
            newProcessedList[index].status = 'processing' as 'processing';
            setProcessedList([...newProcessedList]);

            try {
                // processImage 会负责填充 originalDimensions 和 processedDimensions
                const result = await processImage(item.originalFile, settings);

                newProcessedList[index] = {
                    ...item,
                    ...result,
                    status: 'success' as 'success'
                };

            } catch (error) {
                newProcessedList[index].status = 'failed' as 'failed';
                newProcessedList[index].errorMessage = error instanceof Error ? error.message : '处理过程中发生未知错误';
            }

            completedCount++;
            setProgress(Math.round((completedCount / files.length) * 100));
            setProcessedList([...newProcessedList]);
        }

        setIsProcessing(false);
    }, [processedList, files.length, settings, isProcessing]);

    // --- 渲染辅助函数 ---

    const renderFileStatus = (item: ProcessedFile) => {
        switch (item.status) {
            case 'pending': return <span className="text-gray-500">{t('flowStatusPending')}</span>;
            case 'processing': return <span className="text-blue-500 font-medium animate-pulse">{t('flowStatusProcessing')}</span>;
            case 'success': return <span className="text-green-600 font-semibold">✅ {t('flowStatusSuccess')}</span>;
            case 'failed': return <span className="text-red-600 font-semibold">❌ {t('flowStatusFailed')}</span>;
            default: return null;
        }
    };

    // ... (统计代码保持不变)
    const successCount = processedList.filter(f => f.status === 'success').length;
    const totalOriginalSize = processedList.reduce((acc, item) => acc + (item.originalSize || 0), 0);
    const totalProcessedSize = processedList.filter(f => f.status === 'success').reduce((acc, item) => acc + (item.processedSize || 0), 0);
    const totalSizeReduction = totalOriginalSize - totalProcessedSize;
    const sizeDiffPercentage = totalOriginalSize > 0 ? ((totalOriginalSize - totalProcessedSize) / totalOriginalSize) * 100 : 0;

    // 计算当前页的数据
    const currentItems = processedList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="my-8 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700"> 3. {t('flowHeading')}</h2>

            {/* 动作按钮区 */}
            <div className="flex items-center space-x-4 mb-6">
                {progress !== 100 && (
                    <button
                        onClick={startProcessing}
                        disabled={isProcessing || files.length === 0}
                        // 按钮颜色和动画增强
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-48"
                    >
                        {isProcessing ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                {tf('flowProcessing', { 'progress': progress })}

                            </div>
                        ) : t('flowStartProcessing')}
                    </button>
                )}

                {/* 下载按钮 - 完成时突出显示 */}
                {successCount > 0 && !isProcessing && (
                    <button
                        onClick={() => batchDownload(processedList.filter(f => f.status === 'success'))}
                        className={`font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md flex items-center ${progress === 100 ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-400/50' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                    >
                        ⬇️ {tf('flowDownloadAll', { 'count': successCount })}
                    </button>
                )}

                {/* 补充：处理完成提示 (在没有下载按钮时，例如没有成功的图片) */}
                {progress === 100 && successCount === 0 && !isProcessing && (
                    <span className="text-xl font-semibold text-red-600">
                        {t('flowDoneNoSuccess')}
                    </span>
                )}
            </div>

            {/* 总结卡片 - 增强视觉效果 */}
            {(isProcessing || successCount > 0) && (
                <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-100 shadow-inner">
                    <p className="text-xl font-bold text-blue-900">
                        {tf("flowSummaryTitle", { 'successCount': successCount, 'totalCount': files.length })}
                    </p>
                    <p className="text-base text-blue-800 mt-2">
                        {t('flowSummarySaved')}
                        <span className="font-extrabold text-red-600 ml-2">
                            {tf('flowSavedReduction', {
                                'reduction': formatBytes(totalSizeReduction),
                                'percentage': sizeDiffPercentage.toFixed(2)
                            })}
                        </span>
                    </p>
                </div>
            )}

            {/* 文件列表 - 升级为可交互的对比面板 */}
            <div className="mt-6 space-y-3">
                {currentItems.map((item) => (
                    <div key={item.id} className={`border rounded-xl transition-all duration-300 ${item.status === 'success' ? 'border-green-300 bg-white shadow-sm hover:shadow-md' :
                        item.status === 'failed' ? 'border-red-400 bg-red-50 shadow-inner' :
                            item.status === 'processing' ? 'border-blue-300 bg-blue-50 shadow-inner' :
                                'border-gray-300 bg-white'
                        }`}>

                        {/* 列表头部：点击展开/收缩 - 调整为 4 列布局 */}
                        <div
                            className={`flex justify-between items-center p-4 cursor-pointer ${item.status === 'success' ? 'hover:bg-green-50' : ''}`}
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >

                            {/* 1. 文件名 (w-2/5) */}
                            <div className="w-2/5 truncate font-semibold text-gray-900">
                                {item.outputFileName || item.originalFile.name}
                            </div>

                            {/* 3. 状态指示器 (w-1/5) */}
                            <div className="w-1/5 text-center">
                                {renderFileStatus(item)}
                            </div>


                            {/* 2. 尺寸信息 (w-1/5) <-- 新增列 */}
                            <div className="w-1/5 text-center text-sm">
                                {item.status === 'success' && item.processedDimensions.width > 0 ? (
                                    <span className="font-medium text-green-600">
                                        {item.processedDimensions.width}x{item.processedDimensions.height} px
                                    </span>
                                ) : item.originalDimensions?.width > 0 ? (
                                    <span className="text-gray-500">
                                        {item.originalDimensions.width}x{item.originalDimensions.height} px
                                    </span>
                                ) : (
                                    <span className="text-gray-400">{t('flowDetailLoadingDimensions')}</span>
                                )}
                            </div>

                            <div className="w-1/5 text-center">
                                {item.status === 'success' && (<span className="text-gray-400">{t('flowCompare')}</span>)}
                            </div>

                            {/* 4. 尺寸对比 (w-1/5) */}
                            <div className="w-1/5 text-right text-sm text-gray-600">
                                <div className='flex flex-col items-end'>
                                    <span className="line-through text-xs">{formatBytes(item.originalSize)}</span>
                                    {item.processedSize > 0 && (
                                        <span className={`font-extrabold ${item.processedSize < item.originalSize ? 'text-red-500' : 'text-green-600'}`}>
                                            {formatBytes(item.processedSize)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 详情/对比面板 (仅在成功且展开时显示) */}
                        {expandedId === item.id && item.status === 'success' && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex space-x-6">
                                {/* 原始图片 */}
                                <div className="w-1/2 text-center">
                                    <p className="font-semibold mb-2 text-gray-400">{tf('flowDetailOriginal', { 'size': formatBytes(item.originalSize) })}</p>
                                    <img
                                        src={URL.createObjectURL(item.originalFile)}
                                        alt="Original"
                                        className="max-w-full max-h-40 mx-auto border-2 border-gray-300 rounded-lg object-contain"
                                    />
                                    {/* 尺寸显示在预览下方 */}
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {item.originalDimensions?.width || '?'}x{item.originalDimensions?.height || '?'} px
                                    </p>
                                </div>

                                {/* 处理后图片 */}
                                <div className="w-1/2 text-center">
                                    <p className="font-semibold mb-2 text-green-600">
                                        {tf('flowDetailProcessed', { 'size': formatBytes(item.processedSize) })}
                                    </p>
                                    <img
                                        src={item.downloadUrl} // 使用处理后的 URL
                                        alt="Processed"
                                        className="max-w-full max-h-40 mx-auto border-2 border-green-500 rounded-lg object-contain"
                                    />
                                    {/* 尺寸显示在预览下方 */}
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {item.processedDimensions?.width || '?'}x{item.processedDimensions?.height || '?'} px
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 失败详情 */}
                        {expandedId === item.id && item.status === 'failed' && (
                            <div className="p-4 border-t border-red-300 bg-red-100 text-red-800 rounded-b-xl">
                                <strong>{t('flowDetailError')}</strong> {item.errorMessage}
                            </div>
                        )}

                    </div>
                ))}
            </div>

            {/* 分页控制 */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 transition-all duration-200"
                >
                   {t('flowPreviousPage')}
                </button>
                <span className="mx-4 text-gray-400" >
                    {tf('flowprefix', { 'currentPage': currentPage, 'itemCounts': Math.ceil(processedList.length / itemsPerPage) })}
                </span>
                <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= Math.ceil(processedList.length / itemsPerPage)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 transition-all duration-200"
                >
                     {t('flowNextPage')}
                </button>
            </div>
        </div>
    );
}