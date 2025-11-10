// app/page.tsx
"use client";
import { useTranslation, Language } from './lib/i18n';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react'; // 引入 useRef
import ImageUploader from './components/ImageUploader';
import { ProcessSettings, defaultSettings } from './components/ProcessSettings';
import ProcessingFlow from './components/ProcessingFlow';
import { ToolSettings } from './lib/types';
import {
    AD_CLIENT_ID,
    AD_SLOT_LEFT_SKYSCRAPER,
    AD_SLOT_RIGHT_SKYSCRAPER,
} from './lib/adConfig';
import { AdUnit } from './components/AdUnit';
import { useAdsense } from './lib/useAdsense'; // Import the custom hook
import Modal from './components/Modal'; // 导入 Modal 组件


export default function HomePage() {
    const processingRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState<ToolSettings>(defaultSettings);
    const [showDonate, setShowDonate] = useState(false);
    const [showContact, setShowContact] = useState(false);

    // 合并 ESC 键处理逻辑
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowDonate(false);
                setShowContact(false);
            }
        };

        if (showDonate || showContact) {
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
    }, [showDonate, showContact]);

    // Replace the old ad initialization with the hook
    useAdsense();

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                async
                src={`https://pagead2.googlesyndicate.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`}
                crossOrigin="anonymous"
            />



            {/* --- 新增：导航栏 (Header) --- */}
            <header className="w-full bg-white shadow-lg sticky top-0 z-50 py-4 px-4 md:px-10 border-b border-gray-200">
                <div className="max-w-8xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {/* Logo / 标题 - 使用应用名称或简化名称 */}
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                            {t('title')}
                        </span>
                        <span className="hidden sm:block text-sm text-gray-500">| {t('subtitle')}</span>
                    </div>
                    {/* 右侧导航项 (可选) */}
                    <nav className="space-x-6 text-gray-600 font-medium hidden md:flex">
                        {/* 占位链接 */}
                        <div>
                            <a
                                href="#"
                                onClick={() => setShowContact(true)}
                                className="hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                                {t('contact')}
                            </a>
                        </div>
                        <div>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setShowDonate(true); }}
                                className="hover:text-indigo-600 transition-colors cursor-pointer">
                                {t('donate')}
                            </a>
                        </div>
                    </nav>
                </div>
            </header>

            {/* --- 主内容区域：应用 padding --- */}
            {/* 这里的 padding 确保内容与导航栏之间有空间 */}
            <div className="p-4 md:p-10 pt-4 md:pt-6">
                {/* --- 核心三列网格布局 (Desktop/XL+) --- */}
                {/* 布局：[左侧广告 (100px)] [主内容] [右侧广告 (100px)] */}
                <div className="grid grid-cols-1 xl:grid-cols-[160px_minmax(0,_1fr)_160px] gap-8 justify-center max-w-8xl mx-auto">

                    {/* --- 广告位 D: 左侧摩天大楼 (Skyscraper) --- */}
                    {/* sticky top-10 确保广告位于粘性导航栏下方 */}
                    <AdUnit AdId={AD_CLIENT_ID} slot={AD_SLOT_LEFT_SKYSCRAPER} />


                    {/* --- 主内容列 (居中) --- */}
                    <div className="flex flex-col items-center w-full">
                        {/* 主容器：更大、圆角、更深的阴影 */}
                        <main className="w-full max-w-5xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl transition-all duration-300 transform hover:shadow-3xl">

                            {/* 主页面标题 - 与导航栏 Logo 分开 */}
                            <h1 className="text-3xl md:text-4xl font-black mb-6 text-center tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                                    ✨{t('mainHeading')}
                                </span>
                            </h1>
                            <p className="text-center text-gray-500 mb-8">{t('mainDescription')}。</p>



                            {/* 1. 上传 - 突出显示区域 */}
                            <div className="border border-dashed border-gray-300 p-6 rounded-2xl bg-indigo-50/50 mb-12">
                                <h2 className="text-2xl font-extrabold mb-5 text-indigo-700 flex items-center">
                                    <span className="mr-3">{t('chooseImages')}</span>
                                </h2>
                                <ImageUploader onFilesSelected={setUploadedFiles} />
                            </div>

                            <div ref={processingRef}>
                                <ProcessSettings settings={settings} onSettingsChange={setSettings} isDisabled={false} />
                            </div>

                            {/* 2. 配置与 3. 执行 (上传文件后显示) */}

                            {uploadedFiles.length > 0 && (
                                <ProcessingFlow
                                    files={uploadedFiles}
                                    settings={settings}
                                    onAddImg={(files) => {
                                        setUploadedFiles(prev => [...prev, ...files]);

                                    }}
                                    onImgClear={() => setUploadedFiles([])}
                                />

                            )}


                        </main>

                        {/* 页脚 - 保持在主内容下方居中 */}
                        <footer className="mt-8 text-gray-500 text-sm text-center">
                            {t('footer')}
                        </footer>
                    </div>

                    {/* --- 广告位 E: 右侧摩天大楼 (Skyscraper) --- */}
                    <AdUnit AdId={AD_CLIENT_ID} slot={AD_SLOT_RIGHT_SKYSCRAPER} />

                </div>
            </div>

            {/* Donate Modal */}
            <Modal isOpen={showDonate} onClose={() => setShowDonate(false)} title={t('donate')}>
                <p className="text-sm text-gray-600 mt-3">{t('donateDescription')}</p>
                <div className="mt-4 flex justify-center">
                    <img src="/qr-code.png" alt="Donate QR" className="w-48 h-48 object-contain rounded-md border" />
                </div>
                <div className="mt-6 flex justify-center space-x-3">
                    <a
                        href="https://buymeacoffee.com/tangtao"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg shadow"
                    >
                        {t('buymeacoffee')}
                    </a>
                </div>
            </Modal>

            {/* Contact Modal */}
            <Modal isOpen={showContact} onClose={() => setShowContact(false)} title={t('fadeback')}>
                <p className="text-sm text-gray-600 mb-4">{t('fadebackDesc')}</p>
                <div className="text-sm text-gray-700 mb-4">
                    {t('sendTo')} <a className="text-indigo-600">{t('myEmail')}</a>
                </div>
                <div className="mt-6 flex justify-center space-x-3">
                    <button
                        onClick={() => { setShowContact(false); }}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white"
                    >
                        {t('confirm')}
                    </button>
                </div>
            </Modal>
        </div>
    );
}