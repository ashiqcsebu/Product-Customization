"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FabricCanvas } from "@/components/canvas/FabricCanvas";
import { PropertiesPanel } from "@/components/canvas/PropertiesPanel";
import { LeftContextPanel } from "@/components/canvas/LeftContextPanel";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import {
    ArrowLeft, Undo2, Redo2, Check, Eye, Share2, ShoppingCart,
    Menu, LayoutTemplate, Type, Image as ImageIcon, Box,
    Sticker, QrCode, UploadCloud, Layers, Square, Puzzle,
    Hand, MousePointer2, Minus, Plus, Grid, HelpCircle
} from "lucide-react";

// Replace with dynamic environment variable in production
const getApiUrl = () => {
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:5000/api/v1`;
    }
    return "http://localhost:5000/api/v1";
};

export default function CustomizerPage() {
    const { productId } = useParams<{ productId: string }>();

    // Connect to global state for tool switching
    const { activeTool, setActiveTool } = useCustomizerStore();

    const { data: product, isLoading: loadingProduct } = useQuery({
        queryKey: ["product", productId],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/products/${productId}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
        }
    });

    const { data: config, isLoading: loadingConfig } = useQuery({
        queryKey: ["config", productId],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/config/${productId}`);
            if (!res.ok) throw new Error("Failed to fetch customizer config");
            return res.json();
        },
        retry: 1
    });

    if (loadingProduct || loadingConfig) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50" suppressHydrationWarning>
                <div className="text-lg font-medium animate-pulse text-indigo-600">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-white text-slate-800 overflow-hidden font-sans">

            {/* 1. TOP HEADER */}
            <header className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 shrink-0 bg-white z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-[15px] leading-tight text-slate-900">
                            {product?.title || "Business Card"}
                        </h1>
                        <span className="text-[12px] text-slate-500 leading-tight block mt-0.5">3.5 × 2 in</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-600 h-9 px-3"><Undo2 className="w-4 h-4 mr-2" /> Undo</Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 h-9 px-3"><Redo2 className="w-4 h-4 mr-2" /> Redo</Button>
                    <div className="flex items-center gap-2 ml-2 text-emerald-600 text-sm font-medium mr-6">
                        <Check className="w-4 h-4" /> All changes saved
                    </div>

                    <Button variant="outline" size="sm" className="h-9 font-medium text-slate-700 bg-white" onClick={() => {
                        const canvas = (window as any).canvas;
                        if (canvas) {
                            const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
                            const w = window.open();
                            if (w) w.document.write(`<img src="${dataUrl}" style="max-width: 100%; border: 1px solid #ccc; margin: 20px auto; display: block;" />`);
                        }
                    }}><Eye className="w-4 h-4 mr-2" /> Preview</Button>
                    <Button variant="outline" size="sm" className="h-9 font-medium text-slate-700 bg-white"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                    <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 ml-2" onClick={() => {
                        const canvas = (window as any).canvas;
                        if (canvas) {
                            const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
                            const a = document.createElement('a');
                            a.href = dataUrl;
                            a.download = 'shabu-design.png';
                            a.click();
                        }
                    }}>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart (Save UI)
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-600 ml-1">
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </header>

            {/* 2. MAIN LAYOUT FLEX */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* A. VERY LEFT PRIMARY TOOLBAR */}
                <aside className="w-[84px] bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-1 shrink-0 z-20">
                    <ToolButton icon={<LayoutTemplate />} label="Templates" active={activeTool === "templates"} onClick={() => setActiveTool("templates")} />
                    <ToolButton icon={<Type />} label="Text" active={activeTool === "text"} onClick={() => setActiveTool("text")} />
                    <ToolButton icon={<ImageIcon />} label="Images" active={activeTool === "images"} onClick={() => setActiveTool("images")} />
                    <ToolButton icon={<Box />} label="Shapes" active={activeTool === "shapes"} onClick={() => setActiveTool("shapes")} />
                    <ToolButton icon={<Sticker />} label="Clipart" active={activeTool === "clipart"} onClick={() => setActiveTool("clipart")} />
                    <ToolButton icon={<QrCode />} label="QR Code" active={activeTool === "qrcode"} onClick={() => setActiveTool("qrcode")} />
                    <ToolButton icon={<UploadCloud />} label="Uploads" active={activeTool === "uploads"} onClick={() => setActiveTool("uploads")} />
                    <ToolButton icon={<Layers />} label="Layers" active={activeTool === "layers"} onClick={() => setActiveTool("layers")} />
                    <ToolButton icon={<Square />} label="Background" active={activeTool === "background"} onClick={() => setActiveTool("background")} />
                    <ToolButton icon={<Puzzle />} label="Elements" active={activeTool === "elements"} onClick={() => setActiveTool("elements")} />
                </aside>

                {/* B. SECONDARY CONTEXT PANEL */}
                <aside className="w-[300px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto custom-scrollbar">
                    <LeftContextPanel />
                </aside>

                {/* C. CENTER CANVAS EXPEREINCE */}
                <main className="flex-1 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50 overflow-hidden">

                    {/* Floating Top Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white h-12 rounded-lg shadow-sm border border-slate-200 flex items-center px-2 gap-1 z-20">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-orange-500 bg-orange-50 rounded-md"><Hand className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-600 bg-indigo-50 rounded-md"><MousePointer2 className="w-5 h-5" /></Button>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500"><Minus className="w-4 h-4" /></Button>
                            <span className="text-sm font-medium w-12 text-center text-slate-700">100%</span>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500"><Plus className="w-4 h-4" /></Button>
                        </div>
                        <Separator orientation="vertical" className="h-6 mx-1" />
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500"><Grid className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500"><HelpCircle className="w-5 h-5" /></Button>
                    </div>

                    {/* Canvas Wrapper */}
                    <div className="flex-1 w-full h-full p-8 pb-32 flex items-center justify-center overflow-auto relative">
                        {!config ? (
                            <div className="bg-white p-8 rounded-lg shadow border border-slate-200 text-center max-w-sm">
                                <p className="font-semibold text-lg text-slate-800">No Customization Template Found!</p>
                                <p className="text-sm text-slate-500 mt-2">Admin needs to configure Print Areas and Dimensions for this product.</p>
                                <Button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700" onClick={async () => {
                                    await fetch(`${getApiUrl()}/config/${productId}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            name: "Business Card Template",
                                            canvas: { logicalWidth: 1050, logicalHeight: 600 },
                                            views: [
                                                { key: "front", label: "Front", printArea: { x: 0, y: 0, width: 1, height: 1 }, physicalSize: { width: 3.5, height: 2, unit: "inch", dpi: 300 } },
                                                { key: "back", label: "Back", printArea: { x: 0, y: 0, width: 1, height: 1 }, physicalSize: { width: 3.5, height: 2, unit: "inch", dpi: 300 } }
                                            ]
                                        })
                                    });
                                    window.location.reload();
                                }}>Seed Default Config</Button>
                            </div>
                        ) : (
                            <div className="shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-[1px] bg-gradient-to-b from-white to-slate-100 relative">
                                {/* The indicator borders from the screenshot overlaying around the canvas bounds */}
                                <div className="absolute -inset-4 border border-dashed border-red-400 pointer-events-none"></div>
                                <div className="absolute -inset-2 border border-dashed border-slate-400 pointer-events-none"></div>
                                <div className="absolute inset-2 border border-dashed border-emerald-400 pointer-events-none z-10"></div>

                                <div className="w-[1050px] max-w-full aspect-[3.5/2] relative bg-white overflow-hidden"
                                    style={{ maxWidth: 'calc(100vw - 750px)' }}>
                                    <FabricCanvas
                                        logicalWidth={config.canvas.logicalWidth}
                                        logicalHeight={config.canvas.logicalHeight}
                                        printArea={undefined} // handled by external border overlay for this UI
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Bottom Navigation Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-white border-t border-slate-200 flex items-center justify-between px-6 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                        {/* Left Views */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1 items-center">
                                <div className="w-24 h-14 bg-white border-2 border-indigo-500 rounded-md p-1 shadow-sm relative cursor-pointer overflow-hidden">
                                    <div className="w-full h-full bg-slate-900 rounded-sm"></div>
                                    {/* Mock placeholder */}
                                </div>
                                <span className="text-[11px] font-bold text-slate-800">Front</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center opacity-60 hover:opacity-100 transition-opacity">
                                <div className="w-24 h-14 bg-white border border-slate-300 rounded-md p-1 cursor-pointer overflow-hidden">
                                    <div className="w-full h-full bg-slate-800 rounded-sm"></div>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600">Back</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center ml-2">
                                <div className="w-24 h-14 bg-slate-50 border border-dashed border-slate-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors text-slate-400">
                                    <Plus className="w-5 h-5 mb-1" />
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 mt-[20px] absolute bottom-[18px]">Add Side</span>
                            </div>
                        </div>

                        {/* Center Zoom Bar */}
                        <div className="flex flex-col gap-2 items-center w-64 pr-10">
                            <div className="flex items-center justify-between w-full text-[11px] font-semibold text-slate-700">
                                <span>Zoom</span>
                            </div>
                            <div className="flex items-center w-full gap-3">
                                <Button variant="outline" size="icon" className="w-7 h-7 rounded"><Minus className="w-3 h-3" /></Button>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative">
                                    <div className="absolute left-0 top-0 h-full w-1/2 bg-indigo-500 rounded-full"></div>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-indigo-600 rounded-full shadow border-2 border-white"></div>
                                </div>
                                <span className="text-xs font-bold w-10 text-right text-slate-800">100%</span>
                                <Button variant="outline" size="icon" className="w-7 h-7 rounded"><Grid className="w-3 h-3" /></Button>
                            </div>
                        </div>

                        {/* Right Size Specifier */}
                        <div className="flex flex-col gap-2 relative border-l border-slate-200 pl-8">
                            <div className="flex items-center justify-between w-full text-[11px] font-semibold text-slate-700">
                                <span>Canvas Size</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white h-9 focus-within:ring-1 focus-within:ring-indigo-500">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 h-full flex items-center border-r border-slate-200">W</span>
                                    <input type="text" defaultValue="1050" className="w-12 text-sm text-center outline-none font-medium text-slate-700" />
                                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 h-full flex items-center border-l border-slate-200">px</span>
                                </div>
                                <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white h-9 focus-within:ring-1 focus-within:ring-indigo-500">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 h-full flex items-center border-r border-slate-200">H</span>
                                    <input type="text" defaultValue="600" className="w-12 text-sm text-center outline-none font-medium text-slate-700" />
                                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 h-full flex items-center border-l border-slate-200">px</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8 mx-1 hover:text-slate-700">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 6.5V5C5 3.61929 6.11929 2.5 7.5 2.5C8.88071 2.5 10 3.61929 10 5V6.5H10.5C11.3284 6.5 12 7.17157 12 8V12.5C12 13.3284 11.3284 14 10.5 14H4.5C3.67157 14 3 13.3284 3 12.5V8C3 7.17157 3.67157 6.5 4.5 6.5H5ZM6 6.5H9V5C9 4.17157 8.32843 3.5 7.5 3.5C6.67157 3.5 6 4.17157 6 5V6.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </Button>
                                <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 ml-2 shadow-sm rounded-md">
                                    Fit to Screen
                                </Button>
                            </div>
                        </div>

                    </div>
                </main>

                {/* D. RIGHT PANEL (PROPERTIES) */}
                <aside className="w-[340px] bg-white border-l border-slate-200 shrink-0 z-20 overflow-y-auto">
                    <PropertiesPanel />
                </aside>

            </div>
        </div>
    );
}

// Helper component for the very left toolbar
function ToolButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-[72px] h-[72px] flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all ${active
                ? "bg-indigo-50 text-indigo-700"
                : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
        >
            <div className={`[&>svg]:w-[22px] [&>svg]:h-[22px] [&>svg]:stroke-[1.5px] ${active ? "text-indigo-600" : ""}`}>
                {icon}
            </div>
            <span className={`text-[10px] tracking-wide ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
        </button>
    );
}
