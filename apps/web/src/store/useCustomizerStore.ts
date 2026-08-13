import { create } from "zustand";

interface CustomizerState {
    activeObjectId: string | null;
    activeObjectType: string | null;
    canvasRef: any | null;

    setActiveObject: (id: string | null, type: string | null) => void;
    setCanvas: (canvas: any) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
    activeObjectId: null,
    activeObjectType: null,
    canvasRef: null,

    setActiveObject: (id, type) => set({ activeObjectId: id, activeObjectType: type }),
    setCanvas: (canvas) => set({ canvasRef: canvas }),
}));
