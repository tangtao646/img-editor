// app/lib/imageProcessor.ts
import imageCompression from 'browser-image-compression';
import { ToolSettings, ProcessedFile } from './types';

// 提取 imageCompression 的 Options 类型
type CompressionOptions = Parameters<typeof imageCompression>[1]; 

// --- 新增/修改点 1: 导出 loadImage 辅助函数 ---
// 辅助函数：将 File/Blob 转换为 HTML Image 元素，以便获取尺寸 (用于预加载和处理)
export const loadImage = (file: File | Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        // File 继承自 Blob，因此可以直接使用 createObjectURL
        const url = URL.createObjectURL(file); 
        const img = new Image();
        
        img.onload = () => {
            URL.revokeObjectURL(url); // 图片加载完成后，释放临时 URL 资源
            resolve(img);
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url); // 错误时也要释放
            reject(new Error("图片加载失败"));
        };
        img.src = url;
    });
};

// 核心图片处理函数
export async function processImage(file: File, settings: ToolSettings): Promise<ProcessedFile> {
    try {
        // 预先加载原始图片以获取准确尺寸，即使在压缩之前，这确保了原始尺寸的准确性
        const originalImg = await loadImage(file);
        const originalDimensions = { width: originalImg.width, height: originalImg.height };

        let inputFileBlob: File = file;

        // ----------------------------------------
        // 1. 尺寸和初始压缩 (使用 browser-image-compression)
        // ----------------------------------------
        if (settings.resize.enabled || settings.optimization.maxSizeMB > 0) {
            
            // 构建压缩选项
            const compressionOptions: CompressionOptions = {
                maxSizeMB: settings.optimization.maxSizeMB > 0 ? settings.optimization.maxSizeMB : Infinity, 
                // 我们主要依靠 Canvas API 进行精确尺寸控制，这里只做预压缩和最大尺寸限制
                maxWidthOrHeight: settings.resize.enabled && settings.resize.mode === 'max_side' ? settings.resize.value : undefined, 
                useWebWorker: true, 
                initialQuality: settings.format.quality,
            };
            
            // 浏览器兼容性库进行第一次压缩/最大尺寸限制
            inputFileBlob = await imageCompression(file, compressionOptions);
        }

        // ----------------------------------------
        // 2. 格式转换和精确尺寸调整 (使用 Canvas API)
        // ----------------------------------------
        
        // 使用 loadImage 加载压缩后的 Blob/File 以进行 Canvas 处理
        const img = await loadImage(inputFileBlob);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!; 
        
        let targetWidth = img.width;
        let targetHeight = img.height;
        
        // 最终尺寸计算
        if (settings.resize.enabled) {
            const aspect = originalDimensions.width / originalDimensions.height; // 始终基于原始比例计算
            const { value } = settings.resize;

            if (settings.resize.mode === 'fixed_width') {
                targetWidth = value;
                targetHeight = Math.round(targetWidth / aspect);
            } else if (settings.resize.mode === 'fixed_height') {
                targetHeight = value;
                targetWidth = Math.round(targetHeight * aspect);
            } else if (settings.resize.mode === 'max_side') {
                const maxDim = value;
                // 仅在原图尺寸超过最大值时才进行缩放
                if (originalDimensions.width > maxDim || originalDimensions.height > maxDim) {
                    if (originalDimensions.width > originalDimensions.height) {
                        targetWidth = maxDim;
                        targetHeight = Math.round(maxDim / aspect);
                    } else {
                        targetHeight = maxDim;
                        targetWidth = Math.round(maxDim * aspect);
                    }
                } else {
                     // 如果原始尺寸小于 max_side，则不进行缩放
                     targetWidth = originalDimensions.width;
                     targetHeight = originalDimensions.height;
                }
            } else if (settings.resize.mode === 'percentage') {
                 const ratio = value / 100;
                 targetWidth = Math.round(originalDimensions.width * ratio);
                 targetHeight = Math.round(originalDimensions.height * ratio);
            }
        }
        
        // 绘制到 Canvas 上
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // 最终格式和质量设置
        const outputMimeType = settings.format.type === 'webp' ? 'image/webp' : 'image/jpeg';
        const outputExtension = settings.format.type === 'webp' ? 'webp' : 'jpg';
        const quality = settings.format.quality; 

        // 从 Canvas 导出最终 Blob
        const outputBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob: Blob | null) => { 
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error(`无法将图片导出为 ${outputMimeType}。`)); 
                }
            }, outputMimeType, quality);
        });

        // ----------------------------------------
        // 3. 封装并返回结果
        // ----------------------------------------

        const newFileName = file.name.replace(/\.[^/.]+$/, "") + `_processed.${outputExtension}`;
        
        const finalProcessedFile: ProcessedFile = {
            id: file.name,
            originalFile: file,
            status: 'success',
            originalSize: file.size,
            processedSize: outputBlob.size,
            processedMimeType: outputMimeType,
            originalDimensions: originalDimensions,
            processedDimensions: { width: targetWidth, height: targetHeight },
            outputFileName: newFileName,
            downloadUrl: URL.createObjectURL(outputBlob),
            // 创建最终的 File 对象
            file: new File([outputBlob], newFileName, { type: outputMimeType }) 
        };
        
        return finalProcessedFile;

    } catch (error) {
        console.error('Image processing failed:', error);
        // 失败时必须提供所有非可选属性的默认值
        const failedFile: ProcessedFile = {
            id: file.name,
            originalFile: file,
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : '未知处理错误',
            originalSize: file.size,
            processedSize: 0,
            processedMimeType: '',
            outputFileName: file.name,
            downloadUrl: '',
            file: file,
            originalDimensions: { width: 0, height: 0 },
            processedDimensions: { width: 0, height: 0 }
        };
        return failedFile;
    }
}