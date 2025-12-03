import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  previewUrl: string | null;
  onImageSelect: (file: File) => void;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ previewUrl, onImageSelect, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Check if it's an image
      if (e.dataTransfer.files[0].type.startsWith('image/')) {
        onImageSelect(e.dataTransfer.files[0]);
      }
    }
  };

  if (previewUrl) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700 group shadow-2xl">
        <img 
          src={previewUrl} 
          alt="Original Upload" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onClear}
            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-transform hover:scale-105"
          >
            <X className="w-4 h-4" />
            Remove Image
          </button>
        </div>
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-medium border border-white/10">
          Source Image
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative w-full aspect-video rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
        ${isDragging 
          ? 'border-brand-500 bg-brand-500/10' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="bg-slate-700/50 p-4 rounded-full mb-4 ring-1 ring-white/10">
        <Upload className={`w-8 h-8 ${isDragging ? 'text-brand-400' : 'text-slate-400'}`} />
      </div>
      
      <h3 className="text-lg font-medium text-white mb-1">
        Upload your photo
      </h3>
      <p className="text-sm text-slate-400 text-center max-w-xs">
        Drag and drop your selfie or click to browse. 
        <br />
        <span className="text-slate-500 text-xs mt-2 block">Supports PNG, JPG, WEBP</span>
      </p>
    </div>
  );
};
