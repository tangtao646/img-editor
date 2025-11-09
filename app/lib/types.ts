// app/lib/types.ts

// 尺寸类型
export interface Dimensions {
    width: number;
    height: number;
}

// 工具设置接口：定义用户所有配置选项
export interface ToolSettings {
  resize: {
    enabled: boolean;
    mode: 'percentage' | 'fixed_width' | 'fixed_height' | 'max_side';
    value: number; 
  };
  format: {
    type: 'webp' | 'jpeg'; // 输出格式
    quality: number; // 质量 (0.0 到 1.0, Canvas toBlob 的参数)
  };
  optimization: {
    maxSizeMB: number; // 目标最大文件大小 (MB)
  };
}

// 处理后的文件结果接口：用于展示列表和下载
export interface ProcessedFile {
    id: string; // 唯一标识符
    originalFile: File;
    status: 'pending' | 'processing' | 'success' | 'failed';
    errorMessage?: string;
    originalDimensions:Dimensions;
    // 处理结果数据
    originalSize: number;
    processedSize: number;
    processedMimeType: string;
    outputFileName: string;
    downloadUrl: string;
    file: File; // 最终处理后的 File 对象
    processedDimensions: Dimensions;
}