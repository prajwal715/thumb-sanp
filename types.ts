
export interface ThumbnailState {
  originalImage: File | null;
  previewUrl: string | null;
  
  // Text Details
  overlayText: string;
  textStyle: string;
  
  // Character Details
  faceExpression: string;
  characterAction: string;
  
  // Scene Details
  background: string;
  visualStyle: string; 
  aspectRatio: string; // "16:9", "9:16", "1:1", "4:3"
  
  generatedImageUrl: string | null;
  isGenerating: boolean;
  isEditing: boolean;
  error: string | null;
}

export interface GenerationRequest {
  imageFile: File;
  overlayText: string;
  textStyle: string;
  faceExpression: string;
  characterAction: string;
  background: string;
  visualStyle: string;
  aspectRatio: string;
}

export interface EditRequest {
  originalImageBase64: string;
  editPrompt: string;
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
