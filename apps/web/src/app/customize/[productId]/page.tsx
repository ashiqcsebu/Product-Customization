"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Replace with dynamic environment variable in production
const getApiUrl = () => {
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:5000/api/v1`;
    }
    return "http://localhost:5000/api/v1";
};

export default function CustomizerPage() {
    const { productId } = useParams();

    // Load product base details
    const { data: product, isLoading: loadingProduct } = useQuery({
        queryKey: ["product", productId],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/products/${productId}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
        }
    });

    // Load customizer setup rules for this specific product
    const { data: config, isLoading: loadingConfig } = useQuery({
        queryKey: ["config", productId],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/config/${productId}`);
            if (!res.ok) throw new Error("Failed to fetch customizer config");
            return res.json();
        },
        // We expect this to fail gracefully if no config exists yet, we should handle that in the UI
        retry: 1
    });

    if (loadingProduct || loadingConfig) {
        return (
            <div className="flex h-screen items-center justify-center" suppressHydrationWarning>
                <div className="text-lg font-medium animate-pulse">Initializing Customizer Workstation...</div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-red-500 m-10 text-center">Failed to load product.</div>;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 relative text-slate-800">

            {/* 1. HEADER */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="font-semibold text-slate-600 hover:text-slate-900">&larr; Back</Button>
                    <Separator orientation="vertical" className="h-6" />
                    <h2 className="font-bold text-lg">{product.title || "Unknown Product"}</h2>
                    {config?.name && <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-sm">Using Config: {config.name}</span>}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100">Undo</Button>
                    <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100">Redo</Button>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <Button variant="outline" size="sm" className="bg-white">Preview</Button>
                    <Button variant="outline" size="sm" className="bg-white">Save</Button>
                    <Button size="sm" className="bg-black text-white px-6">Add to Cart</Button>
                </div>
            </header>

            {/* MAIN WORKSPACE REGION */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* 2. LEFT PANEL - TOOLS */}
                <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col pt-4 shrink-0 overflow-y-auto">
                    <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 hidden md:block">
                        Tools
                    </div>
                    <div className="flex flex-col gap-1 px-2">
                        <Button variant="ghost" className="justify-start text-sm">Aa Text</Button>
                        <Button variant="ghost" className="justify-start text-sm">🖼️ Image Upload</Button>
                        <Button variant="ghost" className="justify-start text-sm">📐 Shapes</Button>
                        <Button variant="ghost" className="justify-start text-sm">🎨 Graphics / Clipart</Button>
                    </div>
                </aside>

                {/* 3. CENTER PANEL - CANVASES */}
                <main className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-8">
                        {/* FABRIC JS MOUNTS HERE LATER */}
                        <div className="w-[80%] max-w-2xl aspect-[3/4] bg-white shadow-xl ring-1 ring-slate-200 relative rounded-sm flex items-center justify-center">
                            {!config ? (
                                <div className="text-center text-slate-400 p-8 border border-dashed border-slate-300 rounded-lg">
                                    <p className="font-semibold text-lg text-slate-600">No Customization Template Found!</p>
                                    <p className="text-sm">Admin needs to configure Print Areas and Dimensions for this product via the backend API.</p>
                                    {/* Temporary button to seed dev config */}
                                    <Button variant="outline" size="sm" className="mt-4" onClick={async () => {
                                        await fetch(`${getApiUrl()}/config/${productId}`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                name: "Default T-Shirt Config",
                                                canvas: { logicalWidth: 1000, logicalHeight: 1200 },
                                                views: [
                                                    { key: "front", label: "Front side", printArea: { x: 0.25, y: 0.2, width: 0.5, height: 0.5 }, physicalSize: { width: 12, height: 16, unit: "inch", dpi: 300 } },
                                                    { key: "back", label: "Back side", printArea: { x: 0.25, y: 0.2, width: 0.5, height: 0.5 }, physicalSize: { width: 12, height: 16, unit: "inch", dpi: 300 } }
                                                ]
                                            })
                                        });
                                        window.location.reload();
                                    }}>Seed Default Config for Testing</Button>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-x-0 top-1/4 bottom-1/4 border-[2px] border-dashed border-blue-400/50 flex items-center justify-center text-blue-500/50 pointer-events-none select-none">
                                        Print Safe Area ({config.views[0]?.label})
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 4. BOTTOM PANEL - VIEWS & PRICING SUB-NAV */}
                    <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                        <div className="flex items-center gap-2">
                            {config?.views?.map((view: any) => (
                                <Button key={view.key} variant="outline" className="rounded-full px-6">{view.label}</Button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 py-1 px-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="text-right">
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Price</div>
                                <div className="text-xl font-black text-slate-800">$ {product.variants?.[0]?.price?.toFixed(2) || "0.00"}</div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* 5. RIGHT PANEL - PROPERTIES */}
                <aside className="w-64 bg-white border-l border-slate-200 shrink-0 overflow-y-auto pt-4 shadow-xl z-20">
                    <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Component Properties
                    </div>
                    <div className="p-4 text-sm text-slate-500 italic text-center mt-10">
                        Select an object on the canvas to view properties...
                    </div>
                </aside>

            </div>
        </div>
    );
}
