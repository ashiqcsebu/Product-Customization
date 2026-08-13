"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Button } from "@/components/ui/button";

export function PropertiesPanel() {
    const { activeObjectId, activeObjectType, canvasRef } = useCustomizerStore();

    if (!activeObjectId || !canvasRef) {
        return (
            <div className="p-4 text-sm text-slate-500 italic text-center mt-10">
                Select an object on the canvas to view properties...
            </div>
        );
    }

    const activeObject = canvasRef.getActiveObject();
    if (!activeObject) return null;

    const handleDelete = () => {
        canvasRef.remove(activeObject);
        canvasRef.discardActiveObject();
        canvasRef.renderAll();
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        activeObject.set("fill", e.target.value);
        canvasRef.renderAll();
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            <div>
                <h3 className="font-semibold text-slate-800 mb-4 capitalize">
                    {activeObjectType} Properties
                </h3>

                {/* Common Properties */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={activeObject.fill as string || "#000000"}
                                onChange={handleColorChange}
                                className="w-8 h-8 rounded shrink-0 cursor-pointer"
                            />
                            <span className="text-sm border bg-slate-50 rounded px-2 py-1 uppercase">{activeObject.fill || "None"}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Opacity</label>
                        <input
                            type="range"
                            min="0" max="1" step="0.1"
                            defaultValue={activeObject.opacity}
                            onChange={(e) => {
                                activeObject.set("opacity", parseFloat(e.target.value));
                                canvasRef.renderAll();
                            }}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
                <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>
                    Delete Object
                </Button>
            </div>
        </div>
    );
}
