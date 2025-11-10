// app/lib/i18n.ts
import { title } from 'process';
import { useState, useCallback } from 'react';

// --- 翻译数据对象 (键名已全部改为小驼峰) ---
const TRANSLATIONS = {
  zh: {
    // App Page Strings
    title: '图片编辑助手',
    subtitle: '免费本地批量图片处理工具',
    aboutUs: '关于我们',
    contact: '联系我们',
    donate: '捐赠赞助',
    fadeback: '意见反馈',
    fadebackDesc: '如果您有任何建议或反馈，请随时通过邮件与我联系。',
    sendTo: '发送至: ',
    myEmail: 'taoge646@gmail.com',
    confirm: '确认',
    buymeacoffee: '请我喝杯咖啡',
    mainHeading: '批量图片处理流程',
    mainDescription: '轻松实现图片格式转换、尺寸调整和文件大小优化。',
    placeholderEmpty: '拖放图片到此，或点击上传，开始您的优化之旅。',
    donateDescription: '如果你觉得这个工具有帮助，欢迎捐赠支持开发与服务器开销。',
    footer: '由图片优化助手提供支持 | 所有处理均在您的浏览器本地完成',
    langSelector: '语言',
    langZh: '中文',
    langEn: 'English',

    // ImageUploader Strings
    chooseImages: '选择图片',
    uploaderCount: '已选择 {count} 个文件',
    uploaderDragText: '拖放图片到此，或点击选择',
    uploaderDragSubtext: '支持 PNG, JPEG, GIF 等格式的图片。',
    uploaderListHeading: '已加载文件列表:',
    uploaderRemoveTitle: '移除文件',
    cancel: '取消',

    // ProcessSettings Strings
    settingsHeading: '处理配置',
    settingsDisabledMessage: '请先上传图片 (步骤 1) 以启用处理配置。',
    formatHeading: '输出格式',
    formatWebp: 'WebP (最佳压缩)',
    formatJpeg: 'JPEG',
    qualityHeading: '压缩质量',
    qualityLabel: 'JPEG/WebP 质量:',
    sizeLimitHeading: '文件大小限制 (MB)',
    sizeLimitPlaceholder: '输入 0 表示不限制',
    sizeLimitSubtext: '如果最终文件大小超过此值，将尝试进一步压缩。',
    resizeHeading: '图片尺寸调整',
    resizeToggle: '启用',
    modeLabel: '缩放模式',
    modeMaxSide: '按最大边长缩放 (适配)',
    modeFixedWidth: '固定宽度',
    modeFixedHeight: '固定高度',
    modePercentage: '按百分比缩放',
    valueLabel: '目标值',
    maxSideSubtext: '最长边将不超过此值。',
    percentageSubtext: '缩放比例 (1% - 100%)。',
    unitPixel: '像素 (px)',
    unitPercentage: '%',

    // ProcessingFlow Strings
    flowHeading: '执行与结果',
    flowStartProcessing: '开始批量处理({count})',
    flowAddMore: '继续添加',
    flowClear: '清空',
    flowClearConfirmTitle: '确认清空所有图片吗？',
    flowClearConfirmDesc: '此操作将移除所有图片和处理结果，无法撤销。',
    flowProcessing: '处理中 ({progress}%)',
    flowDownloadAll: '下载所有 ({count})',
    flowSummaryTitle: '处理概览: {successCount}/{totalCount} 张图片已完成',
    flowSummarySaved: '总计节省空间: ',
    flowSavedReduction: '{reduction} ({percentage}% 减少)',
    flowDoneNoSuccess: '处理完成，但没有图片成功生成。',
    flowStatusPending: '等待配置...',
    flowStatusProcessing: '处理中...',
    flowCompare: '对比查看',
    flowStatusSuccess: '完成',
    flowStatusFailed: '失败',
    flowDetailOriginal: '原图 ({size})',
    flowDetailProcessed: '处理后 ({size})',
    flowDetailLoadingDimensions: '等待尺寸',
    flowDetailError: '错误详情:',
    flowPreviousPage: ' 上一页',
    flowNextPage: ' 下一页',
    flowprefix: '第 {currentPage} 页，共 {itemCounts} 页 ',
  },
  en: {
    // App Page Strings
    title: 'Image Edit Toolkit',
    subtitle: 'Free Local Batch Image Processor',
    aboutUs: 'About Us',
    contact: 'Contact Us',
    donate: 'Donate',
    fadeback: 'Feedback',
    fadebackDesc: 'If you have any suggestions or feedback, feel free to reach out to me via email.',
    sendTo: 'Send to: ',
    myEmail: 'taoge646@gmail.com',
    confirm: 'Confirm',
    buymeacoffee: 'Buy Me a Coffee',
    donateDescription: 'If you find this tool helpful, consider donating to support development and server costs.',
    mainHeading: 'Free Batch Image Processing Flow',
    mainDescription: 'Easily convert formats, resize, and optimize file sizes.',
    placeholderEmpty: 'Drag and drop images here, or click to upload and start your optimization journey.',
    footer: 'Powered by Image Optimization Toolkit | All processing is done locally in your browser',
    langSelector: 'Language',
    langZh: '中文',
    langEn: 'English',

    // ImageUploader Strings
    chooseImages: 'Choose Images',
    uploaderCount: '{count} files selected',
    uploaderDragText: 'Drag and drop images here, or click to select',
    uploaderDragSubtext: 'Supports PNG, JPEG, GIF and more image formats.',
    uploaderListHeading: 'Loaded Files List:',
    uploaderRemoveTitle: 'Remove file',
    cancel: 'Cancel',

    // ProcessSettings Strings
    settingsHeading: 'Processing Settings',
    settingsDisabledMessage: 'Please upload images first (Step 1) to enable processing settings.',
    formatHeading: 'Output Format',
    formatWebp: 'WebP (Best Compression)',
    formatJpeg: 'JPEG',
    qualityHeading: 'Compression Quality',
    qualityLabel: 'JPEG/WebP Quality:',
    sizeLimitHeading: 'File Size Limit (MB)',
    sizeLimitPlaceholder: 'Enter 0 for no limit',
    sizeLimitSubtext: 'If the final file size exceeds this value, further compression will be attempted.',
    resizeHeading: 'Image Resizing',
    resizeToggle: 'Enabled',
    modeLabel: 'Scaling Mode',
    modeMaxSide: 'Scale by Max Side Length (Fit)',
    modeFixedWidth: 'Fixed Width',
    modeFixedHeight: 'Fixed Height',
    modePercentage: 'Scale by Percentage',
    valueLabel: 'Target Value',
    maxSideSubtext: 'The longest side will not exceed this value.',
    percentageSubtext: 'Scaling ratio (1% - 100%).',
    unitPixel: 'pixels (px)',
    unitPercentage: '%',

    // ProcessingFlow Strings
    flowHeading: 'Execution & Results',
    flowStartProcessing: 'Start Batch Processing ({count})',
    flowAddMore: 'Add More',
    flowClear: 'Clear',
    flowClearConfirmTitle: 'Confirm clearing all images?',
    flowClearConfirmDesc: 'This will remove all images and processing results and cannot be undone.',
    flowProcessing: 'Processing ({progress}%)',
    flowDownloadAll: 'Download All ({count})',
    flowSummaryTitle: 'Processing Summary: {successCount}/{totalCount} images completed',
    flowSummarySaved: 'Total Space Saved: ',
    flowSavedReduction: '{reduction} ({percentage}% reduction)',
    flowDoneNoSuccess: 'Processing complete, but no images were successfully generated.',
    flowStatusPending: 'Pending setup...',
    flowStatusProcessing: 'Processing...',
    flowCompare: 'Compare View',
    flowStatusSuccess: 'Complete',
    flowStatusFailed: 'Failed',
    flowDetailOriginal: 'Original ({size})',
    flowDetailProcessed: 'Processed ({size})',
    flowDetailLoadingDimensions: 'Waiting for dimensions',
    flowDetailError: 'Error Details:',
    flowPreviousPage: ' Previous Page',
    flowNextPage: ' Next Page',
    flowprefix: 'Page {currentPage} of {itemCounts} ',

  }
};

export type Language = keyof typeof TRANSLATIONS;
export type TranslationKeys = keyof typeof TRANSLATIONS.zh;


/**
 * 助手函数：根据浏览器语言环境动态获取初始语言。
 */
const getInitialLang = (): Language => {
  // 检查 window/navigator 是否存在（避免在 SSR/静态构建时出错）
  if (typeof window !== 'undefined' && window.navigator.language) {
    const browserLang = window.navigator.language.toLowerCase();

    // 优先匹配我们支持的语言
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
    if (browserLang.startsWith('en')) {
      return 'en';
    }
  }
  // 默认回退
  return 'zh';
};


/**
 * 国际化 Hook，用于管理语言状态和提供翻译函数。
 * * 默认语言 now will use the browser setting if not explicitly provided.
 * * @param defaultLang 默认语言，如果未提供，则根据浏览器语言动态设置。
 * @returns 包含当前语言、设置语言函数、普通翻译函数 (t) 和格式化翻译函数 (tf) 的对象。
 */
export function useTranslation(defaultLang: Language = getInitialLang()) {
  // 使用动态检测或传入的 defaultLang 设置初始状态
  const [lang, setLang] = useState<Language>(defaultLang);

  // 普通翻译函数 (t)
  const t = useCallback((key: TranslationKeys) => {
    const translation = TRANSLATIONS[lang][key];
    if (translation === undefined) {
      console.warn(`[i18n] Missing translation for key: ${key} in language: ${lang}`);
    }
    return translation || key;
  }, [lang]);

  // 格式化翻译函数 (tf)
  const tf = useCallback((key: TranslationKeys, replacements: Record<string, string | number>) => {
    let str = t(key);
    for (const [placeholder, value] of Object.entries(replacements)) {
      // 使用正则表达式进行全局替换，以确保所有匹配的占位符都被替换
      const regex = new RegExp(`{${placeholder}}`, 'g');
      str = str.replace(regex, String(value));
    }
    return str;
  }, [t]);

  return {
    lang,
    setLang,
    t,
    tf,
  };
}