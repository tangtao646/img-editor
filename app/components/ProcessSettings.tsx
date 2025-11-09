// app/components/ProcessSettings.tsx
"use client";

import React from 'react';
import { ToolSettings } from '../lib/types';

// 默认配置对象 (供 page.tsx 使用)
export const defaultSettings: ToolSettings = {
    resize: {
        enabled: true,
        mode: 'max_side',
        value: 1200,
    },
    format: {
        type: 'webp',
        quality: 0.85, // 85% 质量 (0.0 - 1.0)
    },
    optimization: {
        maxSizeMB: 0,
    }
};

interface ProcessSettingsProps {
    settings: ToolSettings;
    onSettingsChange: (newSettings: ToolSettings) => void;
}

export function ProcessSettings({ settings, onSettingsChange }: ProcessSettingsProps) {

    const handleChange = (group: keyof ToolSettings, key: string, value: any) => {
        onSettingsChange({
            ...settings,
            [group]: {
                ...(settings as any)[group],
                [key]: value
            }
        });
    };

    // 🚀 修正：处理模式切换逻辑，实现“百分比默认值”
    const handleModeChange = (newMode: ToolSettings['resize']['mode']) => {
        let newValue = settings.resize.value;

        // 当切换到 'percentage' 时，默认值设置为 100
        if (newMode === 'percentage' && settings.resize.mode !== 'percentage') {
            newValue = 100;
        }
        // 当从 'percentage' 切换到像素模式时，设置一个合理的默认像素值（如 1200）
        else if (settings.resize.mode === 'percentage' && newMode !== 'percentage') {
            if (newValue <= 100) {
                newValue = 1200; // 避免用户切换回来后值太小
            }
        }

        onSettingsChange({
            ...settings,
            resize: {
                ...settings.resize,
                mode: newMode,
                value: newValue
            }
        });
    };

    // --- 渲染辅助函数 ---

    // 渲染质量滑块
    const renderQualitySlider = () => (
        <div className="mt-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">
                JPEG/WebP 质量: <span className="font-semibold text-blue-600">{Math.round(settings.format.quality * 100)}%</span>
            </label>
            <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={settings.format.quality}
                onChange={(e) => handleChange('format', 'quality', parseFloat(e.target.value))}
                // 美化滑块样式
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer range-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ accentColor: '#3b82f6' }}
            />
        </div>
    );

    // 渲染尺寸输入框
    const renderResizeInput = () => {
        const isPercentage = settings.resize.mode === 'percentage';
        const unit = isPercentage ? '%' : '像素 (px)';

        return (
            <div className="flex items-center space-x-3">
                <input
                    type="number"
                    value={settings.resize.value}
                    onChange={(e) => handleChange('resize', 'value', parseInt(e.target.value) || 0)}
                    // 🚀 优化：字体颜色统一为 text-gray-900，确保高对比度
                    className="p-2 border border-gray-300 rounded-lg w-20 text-center font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                    min={isPercentage ? 1 : 16}
                    max={isPercentage ? 100 : 8000}
                />
                <span className="text-gray-500 text-sm">{unit}</span>
            </div>
        );
    };


    return (
        <div className="my-8">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700">⚙️ 2. 处理配置</h2>

            {/* 主配置网格：将所有设置分成两栏 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* === 右栏：格式、质量与大小优化 === */}
                <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-300 space-y-5">

                    {/* 格式选择 */}
                    <div>
                        <h3 className="text-xl font-extrabold mb-3 text-gray-900">输出格式</h3>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="format_type"
                                    checked={settings.format.type === 'webp'}
                                    onChange={() => handleChange('format', 'type', 'webp')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-700">WebP (最佳压缩)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="format_type"
                                    checked={settings.format.type === 'jpeg'}
                                    onChange={() => handleChange('format', 'type', 'jpeg')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-700">JPEG</span>
                            </label>
                        </div>
                    </div>

                    {/* 质量滑块 */}
                    <div className="border-t pt-4">
                        <h3 className="text-xl font-extrabold mb-3 text-gray-900">压缩质量</h3>
                        {renderQualitySlider()}
                    </div>


                </div>

                {/* === 左栏：尺寸调整 === */}
                <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${settings.resize.enabled ? 'bg-white border-2 border-indigo-400' : 'bg-gray-50 border border-gray-300'
                    }`}>
                    <h3 className="text-xl font-extrabold mb-4 flex items-center justify-between text-gray-900">
                        图片尺寸调整
                        <input
                            type="checkbox"
                            checked={settings.resize.enabled}
                            onChange={(e) => handleChange('resize', 'enabled', e.target.checked)}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                    </h3>

                    {settings.resize.enabled && (
                        <div className="space-y-4">
                            {/* 模式选择 */}
                            <div>
                                {/* 🚀 优化：字体颜色统一 */}
                                <label className="block text-sm font-medium mb-1 text-gray-700">缩放模式</label>
                                <select
                                    value={settings.resize.mode}
                                    // 🚀 修正：调用新的处理函数
                                    onChange={(e) => handleModeChange(e.target.value as ToolSettings['resize']['mode'])}
                                    // 🚀 优化：字体颜色统一
                                    className="p-2 border border-gray-300 rounded-lg w-full focus:border-blue-500 text-gray-900"
                                >
                                    <option value="max_side">按最大边长缩放 (适配)</option>
                                    <option value="fixed_width">固定宽度</option>
                                    <option value="fixed_height">固定高度</option>
                                    <option value="percentage">按百分比缩放</option>
                                </select>
                            </div>

                            {/* 值输入 */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">目标值</label>
                                {renderResizeInput()}
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}