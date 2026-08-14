"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fabric } from "fabric";

export function LeftContextPanel() {
    const { activeTool, canvasRef, activeObjectId } = useCustomizerStore();

    const [textProps, setTextProps] = useState({
        fontWeight: 'normal',
        fontStyle: 'normal',
        underline: false,
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontSize: 24,
    });

    useEffect(() => {
        if (activeObjectId && canvasRef) {
            const obj = canvasRef.getActiveObject();
            if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
                setTextProps({
                    fontWeight: obj.fontWeight || 'normal',
                    fontStyle: obj.fontStyle || 'normal',
                    underline: !!obj.underline,
                    textAlign: obj.textAlign || 'center',
                    fontFamily: obj.fontFamily || 'Poppins',
                    fontSize: obj.fontSize || 24,
                });
            }
        }
    }, [activeObjectId, canvasRef]);

    const handleAddText = () => {
        if (!canvasRef) return;
        const text = new fabric.IText('New Text', {
            left: canvasRef.width / 2 / canvasRef.getZoom(),
            top: canvasRef.height / 2 / canvasRef.getZoom(),
            fontFamily: 'Poppins',
            fill: '#1e293b',
            fontSize: 40,
            originX: 'center',
            originY: 'center',
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0)",
                blur: 0,
                offsetX: 0,
                offsetY: 0
            })
        });
        canvasRef.add(text);
        canvasRef.setActiveObject(text);
        canvasRef.renderAll();
    };

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && canvasRef) {
            const reader = new FileReader();
            reader.onload = (f) => {
                const data = f.target?.result;
                fabric.Image.fromURL(data as string, (img: any) => {
                    if (img.width > canvasRef.width) img.scaleToWidth(canvasRef.width * 0.5);
                    img.set({
                        left: canvasRef.width / 2 / canvasRef.getZoom(),
                        top: canvasRef.height / 2 / canvasRef.getZoom(),
                        originX: 'center',
                        originY: 'center'
                    });
                    canvasRef.add(img);
                    canvasRef.setActiveObject(img);
                    canvasRef.renderAll();
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateSelectedText = (key: string, value: any) => {
        if (!canvasRef) return;
        const obj = canvasRef.getActiveObject();
        if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
            obj.set(key, value);
            canvasRef.renderAll();
            canvasRef.fire('object:modified', { target: obj });
            setTextProps(prev => ({ ...prev, [key]: value }));
        }
    };

    const toggleSelectedText = (key: string, v1: any, v2: any) => {
        if (!canvasRef) return;
        const obj = canvasRef.getActiveObject();
        if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
            const current = obj[key as keyof typeof obj];
            const newValue = current === v1 ? v2 : v1;
            obj.set(key, newValue);
            canvasRef.renderAll();
            canvasRef.fire('object:modified', { target: obj });
            setTextProps(prev => ({ ...prev, [key]: newValue }));
        }
    };

    const handleAddShape = (type: 'rect' | 'circle' | 'triangle') => {
        if (!canvasRef) return;
        const center = canvasRef.getCenter();
        let shape;
        const commonProps = {
            left: center.left / canvasRef.getZoom(),
            top: center.top / canvasRef.getZoom(),
            fill: '#4f46e5',
            originX: 'center',
            originY: 'center',
        };

        if (type === 'rect') {
            shape = new fabric.Rect({ ...commonProps, width: 150, height: 150 });
        } else if (type === 'circle') {
            shape = new fabric.Circle({ ...commonProps, radius: 75 });
        } else if (type === 'triangle') {
            shape = new fabric.Triangle({ ...commonProps, width: 150, height: 150 });
        }

        if (shape) {
            canvasRef.add(shape);
            canvasRef.setActiveObject(shape);
            canvasRef.renderAll();
        }
    };

    if (activeTool === "text") {
        return (
            <div className="p-5 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg text-slate-900">Text</h2>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm px-4 h-9" onClick={handleAddText}>
                        Add Text
                    </Button>
                </div>

                <div className="mt-2 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-800 mb-2 block">Font Options</label>
                        <div className="flex gap-2">
                            <select
                                value={textProps.fontWeight}
                                onChange={(e) => updateSelectedText('fontWeight', e.target.value)}
                                className="flex-1 border border-slate-200 rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            >
                                <option value="normal">Regular</option>
                                <option value="bold">Bold</option>
                            </select>
                            <select
                                value={textProps.fontSize}
                                onChange={(e) => updateSelectedText('fontSize', parseInt(e.target.value))}
                                className="w-20 border border-slate-200 rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            >
                                <option value="16">16</option>
                                <option value="24">24</option>
                                <option value="32">32</option>
                                <option value="48">48</option>
                                <option value="64">64</option>
                                <option value="96">96</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 p-1 bg-slate-50 border border-slate-100 rounded-md">
                        <Button variant="ghost" size="icon" className={`h-8 w-8 font-serif font-bold ${textProps.fontWeight === 'bold' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`} onClick={() => toggleSelectedText('fontWeight', 'bold', 'normal')}>B</Button>
                        <Button variant="ghost" size="icon" className={`h-8 w-8 font-serif italic ${textProps.fontStyle === 'italic' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`} onClick={() => toggleSelectedText('fontStyle', 'italic', 'normal')}>I</Button>
                        <Button variant="ghost" size="icon" className={`h-8 w-8 font-serif underline decoration-1 text-lg ${textProps.underline ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`} onClick={() => toggleSelectedText('underline', true, false)}>U</Button>
                        <Separator orientation="vertical" className="h-5" />
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${textProps.textAlign === 'left' ? 'text-indigo-600' : 'text-slate-600'}`} onClick={() => updateSelectedText('textAlign', 'left')}>≡L</Button>
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${textProps.textAlign === 'center' ? 'text-indigo-600' : 'text-slate-600'}`} onClick={() => updateSelectedText('textAlign', 'center')}>≡C</Button>
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${textProps.textAlign === 'right' ? 'text-indigo-600' : 'text-slate-600'}`} onClick={() => updateSelectedText('textAlign', 'right')}>≡R</Button>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3 mt-4">
                            <h3 className="text-sm font-semibold text-slate-800">Font Family</h3>
                        </div>

                        <div className="flex flex-col gap-1 max-h-96 overflow-y-auto pr-1">
                            {['Poppins', 'Montserrat', 'Open Sans', 'Roboto', 'Playfair Display', 'Raleway'].map((font) => (
                                <div
                                    key={font}
                                    onClick={() => updateSelectedText('fontFamily', font)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${textProps.fontFamily === font ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <span className="font-sans" style={{ fontFamily: font }}>{font}</span>
                                    {textProps.fontFamily === font && <Check className="w-4 h-4" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeTool === "uploads" || activeTool === "images") {
        return (
            <div className="p-5 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-lg text-slate-900">Upload Media</h2>
                </div>
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition-colors">
                    <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleAddImage} />
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 block text-center">Click to browse<br />or drag file here</span>
                    <span className="text-xs text-slate-500 mt-2">Max limit: 5MB</span>
                </label>
            </div>
        );
    }

    if (activeTool === "shapes") {
        return (
            <div className="p-5 flex flex-col gap-4 h-full">
                <h2 className="font-semibold text-lg text-slate-900 mb-2">Basic Shapes</h2>
                <div className="grid grid-cols-3 gap-3">
                    <div
                        className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                        onClick={() => handleAddShape('rect')}
                    >
                        <div className="w-10 h-10 bg-currentColor rounded-sm"></div>
                    </div>
                    <div
                        className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                        onClick={() => handleAddShape('circle')}
                    >
                        <div className="w-10 h-10 bg-currentColor rounded-full"></div>
                    </div>
                    <div
                        className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                        onClick={() => handleAddShape('triangle')}
                    >
                        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-currentColor"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 flex flex-col gap-4 h-full">
            <h2 className="font-semibold text-lg text-slate-900 capitalize">{activeTool}</h2>
            <p className="text-sm text-slate-500">More tools coming soon. Select Text or Uploads to test connectivity.</p>
        </div>
    );
}
