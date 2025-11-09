// app/lib/batchDownloader.ts
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessedFile } from './types';

export async function batchDownload(files: ProcessedFile[]): Promise<void> {
    if (files.length === 0) {
        return;
    }

    const zip = new JSZip();
    
    files.forEach(item => {
        if (item.file && item.outputFileName) {
            zip.file(item.outputFileName, item.file);
        }
    });

    try {
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9 
            }
        });

        saveAs(zipBlob, "processed_images.zip");

    } catch (error) {
        console.error("生成 ZIP 文件失败:", error);
        alert("打包下载失败。");
    }
}