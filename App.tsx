
import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { GeneratedResult } from './components/GeneratedResult';
import { ImageEditor } from './components/ImageEditor';
import { generateThumbnail, editThumbnail } from './services/geminiService';
import { ThumbnailState } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  const [state, setState] = useState<ThumbnailState>({
    originalImage: null,
    previewUrl: null,
    
    // Default Values
    overlayText: '',
    textStyle: 'Bold Impact',
    faceExpression: 'Shocked',
    characterAction: '',
    background: '',
    visualStyle: '',
    aspectRatio: '16:9', // Default to YouTube
    
    generatedImageUrl: null,
    isGenerating: false,
    isEditing: false,
    error: null,
  });

  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to result when generated
  useEffect(() => {
    if (state.generatedImageUrl && resultRef.current && !state.isEditing) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.generatedImageUrl, state.isEditing]);

  const handleImageSelect = (file: File) => {
    // Revoke old URL if exists
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    
    const url = URL.createObjectURL(file);
    setState(prev => ({ 
      ...prev, 
      originalImage: file, 
      previewUrl: url, 
      generatedImageUrl: null, 
      isEditing: false,
      error: null 
    }));
  };

  const handleClearImage = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    setState(prev => ({ 
      ...prev, 
      originalImage: null, 
      previewUrl: null, 
      generatedImageUrl: null,
      isEditing: false,
      error: null
    }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null, generatedImageUrl: null, isEditing: false }));

    try {
      const resultUrl = await generateThumbnail({
        imageFile: state.originalImage,
        overlayText: state.overlayText,
        textStyle: state.textStyle,
        faceExpression: state.faceExpression,
        characterAction: state.characterAction || 'Posing for a thumbnail', // Default if empty
        background: state.background || 'A cool abstract background', // Default if empty
        visualStyle: state.visualStyle || 'High quality viral YouTube style', // Default if empty
        aspectRatio: state.aspectRatio
      });
      
      setState(prev => ({ ...prev, generatedImageUrl: resultUrl, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || 'Failed to generate thumbnail. Please try again.' 
      }));
    }
  };

  const handleEditApply = async (selection: { x: number, y: number, width: number, height: number }, editPrompt: string) => {
    if (!state.generatedImageUrl) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const resultUrl = await editThumbnail({
        originalImageBase64: state.generatedImageUrl,
        editPrompt: editPrompt,
        selection: selection
      });

      setState(prev => ({ 
        ...prev, 
        generatedImageUrl: resultUrl, 
        isGenerating: false, 
        isEditing: false // Exit edit mode to show result
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || 'Failed to edit thumbnail. Please try again.' 
      }));
    }
  };

  const isFormValid = !!(state.originalImage && state.overlayText);

  return (
     <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-brand-500/30">
       <Header />
       
       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent pb-1">
              Create Viral Thumbnails in Seconds
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upload your photo, configure the details, and let <span className="text-brand-400 font-semibold">Gemini Nano</span> design a high-CTR thumbnail for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
             {/* Left Column: Upload & Results */}
             <div className="lg:col-span-7 space-y-8">
                <section className={`space-y-4 transition-opacity duration-300 ${state.isEditing ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">1. Source Image</h3>
                  </div>
                  <ImageUploader 
                     previewUrl={state.previewUrl} 
                     onImageSelect={handleImageSelect}
                     onClear={handleClearImage}
                  />
                </section>
                
                {/* Error Display */}
                {state.error && (
                    <div className="animate-in fade-in bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3">
                      <div className="mt-0.5">⚠️</div>
                      <p>{state.error}</p>
                    </div>
                )}

                {/* Result / Editor Section */}
                <div ref={resultRef} className="scroll-mt-24">
                  {state.isGenerating ? (
                    <div className="aspect-video w-full rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-4 animate-pulse">
                      <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
                      <p className="font-medium text-brand-200">
                        {state.isEditing ? "Applying magic edits..." : "Generating your masterpiece..."}
                      </p>
                      <p className="text-sm text-slate-500">This usually takes about 5-10 seconds</p>
                    </div>
                  ) : state.isEditing && state.generatedImageUrl ? (
                     <ImageEditor 
                       imageUrl={state.generatedImageUrl}
                       onCancel={() => setState(prev => ({ ...prev, isEditing: false }))}
                       onApplyEdit={handleEditApply}
                       isProcessing={state.isGenerating}
                     />
                  ) : state.generatedImageUrl ? (
                     <GeneratedResult 
                       imageUrl={state.generatedImageUrl} 
                       onEditClick={() => setState(prev => ({ ...prev, isEditing: true }))}
                     />
                  ) : null}
                </div>
             </div>

             {/* Right Column: Controls */}
             <div className="lg:col-span-5">
                <div className={`sticky top-24 space-y-4 transition-opacity duration-300 ${state.isEditing ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                   <h3 className="text-lg font-semibold text-slate-200">2. Configuration</h3>
                   
                   <ControlPanel 
                     overlayText={state.overlayText}
                     setOverlayText={(t) => setState(prev => ({...prev, overlayText: t}))}
                     textStyle={state.textStyle}
                     setTextStyle={(t) => setState(prev => ({...prev, textStyle: t}))}
                     
                     faceExpression={state.faceExpression}
                     setFaceExpression={(e) => setState(prev => ({...prev, faceExpression: e}))}
                     characterAction={state.characterAction}
                     setCharacterAction={(a) => setState(prev => ({...prev, characterAction: a}))}
                     
                     background={state.background}
                     setBackground={(b) => setState(prev => ({...prev, background: b}))}
                     visualStyle={state.visualStyle}
                     setVisualStyle={(s) => setState(prev => ({...prev, visualStyle: s}))}
                     
                     aspectRatio={state.aspectRatio}
                     setAspectRatio={(r) => setState(prev => ({...prev, aspectRatio: r}))}
                     
                     onGenerate={handleGenerate}
                     isGenerating={state.isGenerating}
                     disabled={!isFormValid || state.isEditing}
                   />
                </div>
             </div>
          </div>
       </main>
     </div>
  );
}

export default App;
