import { create } from "zustand";

interface CustomizerState {
    activeObjectId: string | null;
    activeObjectType: string | null;
    activeTool: string;
    canvasRef: any | null;

    setActiveObject: (id: string | null, type: string | null) => void;
    setActiveTool: (tool: string) => void;
    setCanvas: (canvas: any) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
    activeObjectId: null,
    activeObjectType: null,
    activeTool: "text",
    canvasRef: null,

    setActiveObject: (id, type) => set({ activeObjectId: id, activeObjectType: type }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    setCanvas: (canvas) => set({ canvasRef: canvas }),
}));
