import React, { useRef, useState, useEffect } from 'react';
import { Check, X, Undo, Sparkles, Loader2, MousePointerClick } from 'lucide-react';

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageEditorProps {
  imageUrl: string;
  onCancel: () => void;
  onApplyEdit: (selection: Selection, prompt: string) => void;
  isProcessing: boolean;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onCancel, onApplyEdit, isProcessing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState('');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Load and draw image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Set canvas size to match the container's width, but maintain aspect ratio
      if (containerRef.current) {
        // We actually want the canvas to match the IMAGE resolution for drawing accuracy,
        // but display it scaled via CSS. However, for simplicity of coordinate mapping,
        // let's make the canvas match the display size and scale coordinates later, 
        // OR better: make canvas match image size and scale via CSS.
        
        // Let's use internal resolution = image resolution
        canvas.width = img.width;
        canvas.height = img.height;
        setImageSize({ width: img.width, height: img.height });
        
        ctx.drawImage(img, 0, 0);
      }
    };
  }, [imageUrl]);

  // Redraw when selection changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    // Ensure image is loaded before redrawing (should be cached by browser)
    // In a real app we might want to keep the img object in a ref.
    if (img.complete) {
        draw(ctx, img);
    } else {
        img.onload = () => draw(ctx, img);
    }
    
    function draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
       // Clear and Draw Image
       context.clearRect(0, 0, canvas!.width, canvas!.height);
       context.drawImage(image, 0, 0);

       // Draw Overlay
       if (selection) {
         context.fillStyle = 'rgba(0, 0, 0, 0.5)';
         context.fillRect(0, 0, canvas!.width, canvas!.height);
         
         // Clear Rect for selection (make it look like a hole)
         context.clearRect(selection.x, selection.y, selection.width, selection.height);
         
         // Draw Image again inside the selection to make it fully clear (no opacity)
         context.save();
         context.beginPath();
         context.rect(selection.x, selection.y, selection.width, selection.height);
         context.clip();
         context.drawImage(image, 0, 0);
         context.restore();

         // Draw Border
         context.strokeStyle = '#f472b6'; // Pink-400
         context.lineWidth = 4;
         context.strokeRect(selection.x, selection.y, selection.width, selection.height);
       }
    }

  }, [selection, imageUrl]);

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isProcessing) return;
    const { x, y } = getCanvasCoordinates(e);
    setIsDragging(true);
    setStartPos({ x, y });
    setSelection({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isProcessing) return;
    const { x, y } = getCanvasCoordinates(e);
    
    const width = x - startPos.x;
    const height = y - startPos.y;

    setSelection({
      x: width < 0 ? x : startPos.x,
      y: height < 0 ? y : startPos.y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (selection && prompt) {
      onApplyEdit(selection, prompt);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
       <div className="flex items-center justify-between">
         <h3 className="text-xl font-bold text-white flex items-center gap-2">
           <Sparkles className="w-5 h-5 text-pink-400" />
           Magic Editor
         </h3>
         <button 
           onClick={onCancel}
           disabled={isProcessing}
           className="text-slate-400 hover:text-white transition-colors"
         >
           <X className="w-6 h-6" />
         </button>
       </div>

       <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative group" ref={containerRef}>
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className={`w-full h-auto cursor-crosshair touch-none ${isProcessing ? 'opacity-50' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {!selection && !isDragging && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 border border-white/10 shadow-lg">
                   <MousePointerClick className="w-5 h-5 text-pink-400" />
                   Draw a box around what you want to change
                </div>
             </div>
          )}
          
          {isProcessing && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
                <div className="text-center space-y-3">
                   <Loader2 className="w-10 h-10 animate-spin text-brand-500 mx-auto" />
                   <p className="font-bold text-white">Applying Magic...</p>
                </div>
             </div>
          )}
       </div>

       <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What should change in the selected area? (e.g., 'Change to a surprised face')"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500"
            disabled={isProcessing}
          />
          <div className="flex gap-2">
             <button
                onClick={() => setSelection(null)}
                disabled={!selection || isProcessing}
                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Clear Selection"
             >
                <Undo className="w-5 h-5" />
             </button>
             <button
                onClick={handleSubmit}
                disabled={!selection || !prompt || isProcessing}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
             >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Apply Edit
             </button>
          </div>
       </div>
    </div>
  );
};