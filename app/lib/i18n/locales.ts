export type Language = 'zh-CN' | 'en-US';

const TRANSLATIONS: Record<Language, { title: string; description: string }> = {
  'zh-CN': {
    title: '批量图片处理大师',
    description: '本地图片批量转换与尺寸调整工具',
  },
  'en-US': {
    title: 'Batch Image Master',
    description: 'Local Batch Image Conversion and Resizing Tool',
  },
};

// 服务端/模块级安全调用
export function getTranslations(lang?: string) {
  const key = (lang && Object.keys(TRANSLATIONS).includes(lang)) ? (lang as Language) : 'zh-CN';
  return TRANSLATIONS[key];
}