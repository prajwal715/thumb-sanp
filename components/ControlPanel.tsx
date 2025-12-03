
import React, { useState } from 'react';
import { Type, Sparkles, Loader2, Smile, Zap, Gamepad2, Video, Monitor, Ghost, School, User, Image as ImageIcon, Palette, ChevronDown, ChevronUp, Layout, Smartphone, Square, Tv } from 'lucide-react';

interface ControlPanelProps {
  overlayText: string;
  setOverlayText: (value: string) => void;
  textStyle: string;
  setTextStyle: (value: string) => void;
  
  faceExpression: string;
  setFaceExpression: (value: string) => void;
  characterAction: string;
  setCharacterAction: (value: string) => void;
  
  background: string;
  setBackground: (value: string) => void;
  visualStyle: string;
  setVisualStyle: (value: string) => void;
  
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const TEXT_STYLES = [
  { id: 'Bold Impact', label: 'Big & Bold (Impact)', color: 'bg-white text-black font-black' },
  { id: 'Neon Glowing', label: 'Neon / Cyberpunk', color: 'bg-slate-900 text-pink-500 border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' },
  { id: 'Comic Book', label: 'Comic / Pop Art', color: 'bg-yellow-400 text-black border-2 border-black font-bold' },
  { id: '3D Gold', label: 'Shiny 3D Gold', color: 'bg-gradient-to-b from-yellow-300 to-yellow-600 text-white shadow-md' },
  { id: 'Minimalist', label: 'Clean Minimalist', color: 'bg-slate-200 text-slate-800 font-sans' },
  { id: 'Glitch', label: 'Glitch Effect', color: 'bg-black text-green-400 font-mono tracking-widest' },
];

const EXPRESSIONS = [
  { id: 'Shocked', emoji: '😱' },
  { id: 'Happy', emoji: '😁' },
  { id: 'Angry', emoji: '😡' },
  { id: 'Suspicious', emoji: '🤨' },
  { id: 'Crying', emoji: '😢' },
  { id: 'Excited', emoji: '🤩' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: 'YouTube', icon: <Tv className="w-4 h-4" /> },
  { id: '9:16', label: 'Shorts/TikTok', icon: <Smartphone className="w-4 h-4" /> },
  { id: '1:1', label: 'Square', icon: <Square className="w-4 h-4" /> },
  { id: '4:3', label: 'Classic', icon: <Layout className="w-4 h-4" /> },
];

const STYLE_PRESETS = [
  {
    id: 'gaming',
    label: 'Gaming',
    icon: <Gamepad2 className="w-3 h-3" />,
    color: 'from-purple-500 to-indigo-500',
    prompt: 'High contrast gaming aesthetic, saturated colors, speed lines, glowing effects, 4k detailed.'
  },
  {
    id: 'vlog',
    label: 'Vlog',
    icon: <Video className="w-3 h-3" />,
    color: 'from-orange-400 to-pink-500',
    prompt: 'Bright, airy, high key lighting, vibrant natural colors, cozy atmosphere, bokeh background.'
  },
  {
    id: 'tech',
    label: 'Tech',
    icon: <Monitor className="w-3 h-3" />,
    color: 'from-blue-400 to-cyan-500',
    prompt: 'Sleek, modern, metallic textures, cool blue lighting, sharp focus, professional studio look.'
  },
  {
    id: 'cinematic',
    label: 'Movie',
    icon: <Sparkles className="w-3 h-3" />,
    color: 'from-amber-600 to-red-900',
    prompt: 'Cinematic lighting, dramatic shadows, teal and orange color grading, film grain, realistic texture.'
  },
];

const SectionHeader = ({ icon: Icon, title, isOpen, onClick }: { icon: any, title: string, isOpen: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group border border-slate-700/50"
  >
    <div className="flex items-center gap-2 text-slate-200 font-medium">
      <Icon className="w-4 h-4 text-brand-400 group-hover:text-brand-300" />
      {title}
    </div>
    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
  </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  overlayText, setOverlayText,
  textStyle, setTextStyle,
  faceExpression, setFaceExpression,
  characterAction, setCharacterAction,
  background, setBackground,
  visualStyle, setVisualStyle,
  aspectRatio, setAspectRatio,
  onGenerate, isGenerating, disabled
}) => {
  const [openSections, setOpenSections] = useState({
    text: true,
    character: true,
    style: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4 bg-slate-900/20 p-1 rounded-xl">
      
      {/* 1. Text Configuration */}
      <div className="space-y-2">
        <SectionHeader 
          icon={Type} 
          title="Text & Typography" 
          isOpen={openSections.text} 
          onClick={() => toggleSection('text')} 
        />
        {openSections.text && (
          <div className="p-3 space-y-4 bg-slate-800/30 rounded-lg border border-slate-800 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
                Thumbnail Text
              </label>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="e.g. I QUIT MY JOB!"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-bold text-lg"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                Font Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEXT_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setTextStyle(style.id)}
                    className={`
                      px-3 py-2 rounded-md text-xs font-bold transition-all border
                      ${textStyle === style.id 
                        ? 'ring-2 ring-brand-500 border-transparent scale-[1.02]' 
                        : 'border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-500'
                      }
                      ${style.color}
                    `}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Character Details */}
      <div className="space-y-2">
        <SectionHeader 
          icon={User} 
          title="Character & Action" 
          isOpen={openSections.character} 
          onClick={() => toggleSection('character')} 
        />
        {openSections.character && (
          <div className="p-3 space-y-4 bg-slate-800/30 rounded-lg border border-slate-800 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                <Smile className="w-3 h-3" /> Face Expression
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {EXPRESSIONS.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setFaceExpression(exp.id)}
                    className={`
                      flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all
                      ${faceExpression === exp.id 
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow shadow-brand-500/10' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                      }
                    `}
                    title={exp.id}
                  >
                    <span className="text-xl leading-none mb-1">{exp.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
                What are they doing?
              </label>
              <input
                type="text"
                value={characterAction}
                onChange={(e) => setCharacterAction(e.target.value)}
                placeholder="e.g. Holding a pile of cash, Pointing at a chart..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Background & Vibe */}
      <div className="space-y-2">
        <SectionHeader 
          icon={Palette} 
          title="Background, Size & Style" 
          isOpen={openSections.style} 
          onClick={() => toggleSection('style')} 
        />
        {openSections.style && (
          <div className="p-3 space-y-4 bg-slate-800/30 rounded-lg border border-slate-800 animate-in slide-in-from-top-2">
            
            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                 <Layout className="w-3 h-3" /> Image Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                 {ASPECT_RATIOS.map((ratio) => (
                   <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-lg border transition-all gap-1
                      ${aspectRatio === ratio.id 
                        ? 'bg-slate-700 border-brand-500 text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }
                    `}
                   >
                     {ratio.icon}
                     <span className="text-[10px] font-medium">{ratio.label}</span>
                   </button>
                 ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                 <ImageIcon className="w-3 h-3" /> Background Setting
              </label>
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="e.g. Luxury mansion pool, Burning building..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Visual Style
              </label>
              
              {/* Presets */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {STYLE_PRESETS.map((preset) => (
                   <button
                     key={preset.id}
                     onClick={() => setVisualStyle(preset.prompt)}
                     className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 transition-all text-[10px] uppercase font-bold text-slate-300 hover:text-white group whitespace-nowrap"
                   >
                     <span className={`p-0.5 rounded-full bg-gradient-to-br ${preset.color} text-white`}>
                       {preset.icon}
                     </span>
                     {preset.label}
                   </button>
                 ))}
              </div>

              <textarea
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                placeholder="Describe overall artistic style... (e.g. Cartoon, Realistic, 3D Render)"
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all resize-none text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`
          w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg mt-4
          ${disabled 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
            : 'bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Thumbnail
          </>
        )}
      </button>
    </div>
  );
};
