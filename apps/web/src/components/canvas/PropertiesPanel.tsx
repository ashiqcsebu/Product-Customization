"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, ArrowUpToLine, ArrowDownToLine, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { fabric } from "fabric";

export function PropertiesPanel() {
    const { activeObjectId, activeObjectType, canvasRef } = useCustomizerStore();

    // Local state to keep UI in sync with Fabric object properties easily
    const [props, setProps] = useState<any>({});

    useEffect(() => {
        if (!canvasRef || !activeObjectId) return;
        const activeObject = canvasRef.getActiveObject();
        if (activeObject) {
            setProps({
                text: activeObject.text || "",
                fontFamily: activeObject.fontFamily || "Poppins",
                fontWeight: activeObject.fontWeight || "normal",
                fontSize: activeObject.fontSize || 24,
                fill: activeObject.fill || "#000000",
                opacity: (activeObject.opacity ?? 1) * 100,
            });
        }
    }, [activeObjectId, canvasRef]);

    const updateObject = (key: string, value: any) => {
        if (!canvasRef) return;
        const activeObject = canvasRef.getActiveObject();
        if (activeObject) {
            activeObject.set(key, value);
            setProps({ ...props, [key]: value });
            canvasRef.renderAll();
        }
    };

    if (!activeObjectId || !canvasRef) {
        return (
            <div className="p-4 flex flex-col h-full bg-slate-50">
                <h3 className="font-semibold text-slate-800 mb-4 px-2">Properties</h3>
                <div className="flex-1 flex items-center justify-center text-sm text-slate-400 italic text-center p-4">
                    Select an object on the canvas to view and edit its properties.
                </div>
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

    const handleDuplicate = () => {
        activeObject.clone((cloned: any) => {
            cloned.set({
                left: cloned.left + 20,
                top: cloned.top + 20,
                evented: true,
            });
            canvasRef.add(cloned);
            canvasRef.setActiveObject(cloned);
            canvasRef.renderAll();
        });
    };

    const isText = activeObjectType === "i-text" || activeObjectType === "text";

    return (
        <div className="p-5 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-semibold text-[15px] text-slate-900 capitalize">
                    {activeObjectType?.replace('i-', '')} Properties
                </h3>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600" onClick={handleDuplicate}>
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {isText && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Content</label>
                            <textarea
                                className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                rows={2}
                                value={props.text}
                                onChange={(e) => updateObject('text', e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Font</label>
                                <select
                                    className="w-full border border-slate-200 rounded-md h-9 px-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                    value={props.fontFamily}
                                    onChange={(e) => updateObject('fontFamily', e.target.value)}
                                >
                                    <option value="Poppins">Poppins</option>
                                    <option value="Arial">Arial</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Weight</label>
                                <select
                                    className="w-full border border-slate-200 rounded-md h-9 px-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                    value={props.fontWeight}
                                    onChange={(e) => updateObject('fontWeight', e.target.value)}
                                >
                                    <option value="normal">Regular</option>
                                    <option value="bold">Bold</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Size</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range" min="8" max="120"
                                    value={props.fontSize}
                                    onChange={(e) => updateObject('fontSize', parseInt(e.target.value))}
                                    className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex items-center border border-slate-200 rounded text-sm w-16 h-8">
                                    <input type="text" value={props.fontSize} onChange={(e) => updateObject('fontSize', parseInt(e.target.value) || 12)} className="w-10 text-center outline-none" />
                                    <span className="text-slate-400 text-[10px] w-6 bg-slate-50 border-l border-slate-200 flex items-center justify-center h-full rounded-r">px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Color</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center border border-slate-200 rounded-md h-9 overflow-hidden">
                            <input
                                type="color"
                                value={props.fill}
                                onChange={(e) => updateObject('fill', e.target.value)}
                                className="w-8 h-8 rounded absolute left-1 top-0.5 cursor-pointer border-0 p-0"
                            />
                            <input
                                type="text"
                                className="w-full h-full pl-10 pr-2 text-sm outline-none font-medium uppercase text-slate-700"
                                value={props.fill}
                                onChange={(e) => updateObject('fill', e.target.value)}
                            />
                        </div>
                        <div className="w-16 border border-slate-200 rounded-md h-9 flex items-center justify-center text-sm font-medium text-slate-700 bg-slate-50">
                            100%
                        </div>
                    </div>
                </div>

                {isText && (
                    <>
                        <div className="flex justify-between p-1 bg-slate-50 border border-slate-100 rounded-md">
                            <Button variant="ghost" className="h-8 w-12 text-slate-600 bg-white shadow-sm border border-slate-200 rounded"><AlignLeft className="w-4 h-4" /></Button>
                            <Button variant="ghost" className="h-8 w-12 text-slate-600 hover:bg-white rounded"><AlignCenter className="w-4 h-4" /></Button>
                            <Button variant="ghost" className="h-8 w-12 text-slate-600 hover:bg-white rounded"><AlignRight className="w-4 h-4" /></Button>
                            <Button variant="ghost" className="h-8 w-12 text-slate-600 hover:bg-white rounded"><AlignJustify className="w-4 h-4" /></Button>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Letter Spacing</label>
                            <div className="flex items-center gap-3">
                                <input type="range" min="0" max="1000" defaultValue="0" className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                <input type="text" defaultValue="0" className="w-12 h-8 border border-slate-200 rounded text-center text-sm outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Line Height</label>
                            <div className="flex items-center gap-3">
                                <input type="range" min="0.5" max="3" step="0.1" defaultValue="1.2" className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                <input type="text" defaultValue="1.2" className="w-12 h-8 border border-slate-200 rounded text-center text-sm outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-2 block">Text Effects</label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={props.shadow ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 text-[11px] px-1 font-medium ${props.shadow ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'}`}
                                    onClick={() => {
                                        updateObject('shadow', props.shadow ? null : new fabric.Shadow({
                                            color: 'rgba(0,0,0,0.5)',
                                            blur: 5,
                                            offsetX: 2,
                                            offsetY: 2
                                        }));
                                    }}
                                >Shadow</Button>
                                <Button
                                    variant={props.stroke ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 text-[11px] px-1 font-medium ${props.stroke ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'}`}
                                    onClick={() => {
                                        if (props.stroke) {
                                            updateObject('stroke', null);
                                            updateObject('strokeWidth', 0);
                                        } else {
                                            updateObject('stroke', '#000000');
                                            updateObject('strokeWidth', 1);
                                        }
                                    }}
                                >Outline</Button>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] px-1 font-medium bg-white text-slate-700">Curved</Button>
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Opacity</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range" min="0" max="100"
                            value={props.opacity}
                            onChange={(e) => updateObject('opacity', parseInt(e.target.value) / 100)}
                            className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex items-center border border-slate-200 rounded text-sm w-14 h-8">
                            <input type="text" value={props.opacity} onChange={(e) => updateObject('opacity', parseInt(e.target.value) / 100)} className="w-8 text-center outline-none" />
                            <span className="text-slate-400 text-[10px] w-5 bg-slate-50 flex items-center justify-center h-full rounded-r">%</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-700 mb-2 block">Arrange</label>
                    <div className="flex justify-between p-1 border border-slate-200 rounded-md bg-white">
                        <Button variant="ghost" className="h-8 flex-1 text-slate-600 hover:bg-slate-50 rounded" onClick={() => canvasRef.bringToFront(activeObject)}><ArrowUpToLine className="w-4 h-4" /></Button>
                        <Button variant="ghost" className="h-8 flex-1 text-slate-600 hover:bg-slate-50 rounded" onClick={() => canvasRef.bringForward(activeObject)}><ArrowUp className="w-4 h-4" /></Button>
                        <Button variant="ghost" className="h-8 flex-1 text-slate-600 hover:bg-slate-50 rounded" onClick={() => canvasRef.sendBackwards(activeObject)}><ArrowDown className="w-4 h-4" /></Button>
                        <Button variant="ghost" className="h-8 flex-1 text-slate-600 hover:bg-slate-50 rounded" onClick={() => canvasRef.sendToBack(activeObject)}><ArrowDownToLine className="w-4 h-4" /></Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
