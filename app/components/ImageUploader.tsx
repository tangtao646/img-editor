// app/components/ImageUploader.tsx
"use client";

import React, { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export default function ImageUploader({ onFilesSelected }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    onFilesSelected(fileArray);
  }, [onFilesSelected]);

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  // 处理拖放事件
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  };

  return (
    <div 
        className={`p-10 border-4 border-dashed rounded-xl transition-colors cursor-pointer text-center 
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        multiple 
        accept="image/jpeg, image/png, image/bmp, image/tiff" 
        onChange={handleFileChange} 
        className="hidden"
        ref={fileInputRef}
      />
      <p className="text-xl font-medium text-gray-700">
        📥 拖放图片到此处，或点击选择文件
      </p>
      <p className="text-sm text-gray-500 mt-1">支持 JPG, PNG, BMP, TIFF 等常见格式</p>
    </div>
  );
}