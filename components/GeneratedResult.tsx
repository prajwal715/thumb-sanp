import React from 'react';
import { Download, Edit, Wand2 } from 'lucide-react';

interface GeneratedResultProps {
  imageUrl: string;
  onEditClick: () => void;
}

export const GeneratedResult: React.FC<GeneratedResultProps> = ({ imageUrl, onEditClick }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbsnap-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
           <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
           Generated Thumbnail
        </h3>
        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-400 bg-brand-400/10 px-2 py-1 rounded border border-brand-500/20">
          Nano Banana Output
        </span>
      </div>
      
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-brand-500/30 shadow-[0_0_50px_-12px_rgba(14,165,233,0.5)] group">
        <img 
          src={imageUrl} 
          alt="Generated Thumbnail" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="flex-1 bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Download Image
        </button>
        <button 
          onClick={onEditClick}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg border border-slate-700"
        >
          <Wand2 className="w-5 h-5 text-pink-400" />
          Edit Image
        </button>
      </div>
    </div>
  );
};