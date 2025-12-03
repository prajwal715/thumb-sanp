import React from 'react';
import { Zap, Image as ImageIcon } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-brand-500 to-accent-500 p-2 rounded-lg">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ThumbSnap AI
            </h1>
            <p className="text-xs text-slate-500">Powered by Gemini Nano Banana</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <a 
             href="https://ai.google.dev/gemini-api/docs" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-sm text-slate-400 hover:text-white transition-colors"
           >
             API Docs
           </a>
        </div>
      </div>
    </header>
  );
};
