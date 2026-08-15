import { useState } from "react";
import { Plus, Trash2, Settings, GripVertical, Infinity as InfinityIcon } from "lucide-react";

export function ProductOptionsBuilder() {
    const [options] = useState([
        { id: 1, type: "color_swatch", label: "Color", description: "Color swatches", items: ["red", "orange", "yellow", "green", "blue", "purple", "black"], extra: "+ $5.00" },
        { id: 2, type: "image_swatch", label: "Design", description: "Image swatches", items: ["pattern1", "pattern2", "wood", "marble", "terrazzo"], extra: "+ $10.00" },
        { id: 3, type: "text", label: "Personalization", description: "Text field", placeholder: "Emily", help: "Up to 20 characters", extra: "+ $5.00" },
        { id: 4, type: "dropdown", label: "Font Style", description: "Dropdown", placeholder: "Script", extra: "+ $3.00" },
        { id: 5, type: "checkbox", label: "Gift Wrap", description: "Checkbox", text: "Yes, please gift wrap my order", checked: true, extra: "+ $4.00" },
        { id: 6, type: "date", label: "Delivery Date", description: "Date picker", placeholder: "May 24, 2025", extra: "+ $7.00" }
    ]);

    return (
        <div className="flex-1 overflow-auto p-10 bg-[#0A071B] min-h-screen text-slate-100 flex gap-12 font-sans font-medium">
            {/* Left Header/Hero */}
            <div className="w-[450px] shrink-0 pt-8 flex flex-col gap-6">
                <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-xl mb-4 border border-white/10">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-white text-lg">C</div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-wide leading-tight text-white">CRAFTIFY</span>
                        <span className="text-[10px] uppercase tracking-widest text-cyan-300">Unlimited Product Options</span>
                    </div>
                </div>

                <h1 className="text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
                    Go Beyond<br />Shopify's<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">3-Option Limit</span>
                </h1>
                
                <p className="text-lg text-slate-300 max-w-md mt-2 leading-relaxed">
                    Create unlimited custom product options with 42+ option types seamlessly integrated into your store.
                </p>

                <div className="mt-8 flex flex-col gap-4 w-fit">
                    <button className="flex items-center gap-3 bg-slate-900/50 border border-cyan-500/30 px-6 py-3.5 rounded-2xl text-lg font-bold text-white hover:bg-slate-900 transition shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                        <InfinityIcon className="w-6 h-6 text-cyan-400" />
                        Unlimited Options
                    </button>
                    <button className="flex items-center gap-3 bg-slate-900/50 border border-indigo-500/30 px-6 py-3.5 rounded-2xl text-lg font-bold text-slate-200 hover:bg-slate-900 transition">
                        <div className="flex font-black text-indigo-400 text-xl tracking-tight">42+</div>
                        Option Type
                    </button>
                </div>
            </div>

            {/* Right Panel / Interactive Builder */}
            <div className="flex-1 flex flex-col pt-4 max-w-3xl">
                
                {/* MOCK SHOPIFY HEADER */}
                <div className="bg-white rounded-2xl p-6 mb-8 w-fit shadow-xl border border-slate-200 ml-auto mr-12 relative animate-pulse">
                    <h3 className="text-slate-800 font-bold mb-3">Shopify Default option</h3>
                    <div className="flex gap-4">
                        <div className="w-32 h-10 border border-slate-200 rounded-lg flex items-center justify-between px-3 text-slate-500 text-sm">Size <span className="text-xs">▼</span></div>
                        <div className="w-32 h-10 border border-slate-200 rounded-lg flex items-center justify-between px-3 text-slate-500 text-sm">Color <span className="text-xs">▼</span></div>
                        <div className="w-32 h-10 border border-slate-200 rounded-lg flex items-center justify-between px-3 text-slate-500 text-sm">Material <span className="text-xs">▼</span></div>
                    </div>
                    {/* Arrow down pointing to the new tool */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-cyan-400/50 mb-1"></div>
                        <div className="w-2.5 h-2.5 rotate-45 border-b-2 border-r-2 border-cyan-400"></div>
                    </div>
                </div>

                {/* MAIN BUILDER BOARD */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 relative z-10 w-full overflow-hidden">
                    
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-slate-900">Craftify Product Options</h2>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold border border-emerald-100">
                            <InfinityIcon className="w-3.5 h-3.5" /> Unlimited Options
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {options.map((opt) => (
                            <div key={opt.id} className="flex items-center gap-4 py-3 px-1 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition group rounded-lg">
                                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab opacity-0 group-hover:opacity-100 transition" />
                                
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                                    ${opt.type === "color_swatch" ? "bg-cyan-50 text-cyan-500" :
                                      opt.type === "image_swatch" ? "bg-blue-50 text-blue-500" : 
                                      opt.type === "text" ? "bg-emerald-50 text-emerald-500" :
                                      opt.type === "dropdown" ? "bg-purple-50 text-purple-500" :
                                      opt.type === "checkbox" ? "bg-amber-50 text-amber-500" : 
                                      "bg-indigo-50 text-indigo-500"
                                    }`}>
                                    {opt.type === "color_swatch" && <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-400 via-amber-400 to-emerald-400"></div>}
                                    {opt.type === "image_swatch" && <div className="w-5 h-5 bg-blue-300 rounded-sm"></div>}
                                    {opt.type === "text" && <span className="font-serif font-bold text-lg">T</span>}
                                    {opt.type === "dropdown" && <div className="space-y-1"><div className="w-4 h-0.5 bg-current rounded"/><div className="w-4 h-0.5 bg-current rounded"/><div className="w-4 h-0.5 bg-current rounded"/></div>}
                                    {opt.type === "checkbox" && <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-current rounded-sm"></div></div>}
                                    {opt.type === "date" && <div className="w-4 h-4 border-2 border-current rounded-sm border-t-4"></div>}
                                </div>

                                {/* Labels */}
                                <div className="w-32 flex flex-col shrink-0">
                                    <span className="text-sm font-bold text-slate-800">{opt.label}</span>
                                    <span className="text-[11px] text-slate-400 font-medium">{opt.description}</span>
                                </div>

                                {/* Controls Mock representation */}
                                <div className="flex-1 flex flex-col justify-center">
                                    {opt.type === "color_swatch" && (
                                        <div className="flex gap-2 items-center">
                                            {opt.items?.map((c, j) => (
                                                <div key={j} className={`w-7 h-7 rounded-full shadow-sm cursor-pointer ${j === 3 ? 'ring-2 ring-offset-2 ring-emerald-500' : ''}`} style={{ backgroundColor: c }}></div>
                                            ))}
                                        </div>
                                    )}
                                    {opt.type === "image_swatch" && (
                                        <div className="flex gap-2 items-center">
                                            {opt.items?.map((_c, j) => (
                                                <div key={j} className={`w-8 h-8 rounded border border-slate-200 cursor-pointer ${j === 1 ? 'ring-2 ring-offset-2 ring-cyan-500' : ''} bg-slate-100 overflow-hidden`}>
                                                    <div className="w-full h-full bg-slate-300"></div> {/* Mock Image block */}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {opt.type === "text" && (
                                        <div className="flex flex-col gap-1 w-full max-w-xs">
                                            <input type="text" className="w-full h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white" defaultValue={opt.placeholder} />
                                            <span className="text-[10px] text-slate-400 ml-1">{opt.help}</span>
                                        </div>
                                    )}
                                    {opt.type === "dropdown" && (
                                        <div className="w-full max-w-xs h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 flex items-center justify-between bg-white">
                                            {opt.placeholder} <span className="text-xs text-slate-400">▼</span>
                                        </div>
                                    )}
                                    {opt.type === "checkbox" && (
                                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                            <input type="checkbox" checked={opt.checked} readOnly className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500" />
                                            {opt.text}
                                        </label>
                                    )}
                                    {opt.type === "date" && (
                                        <div className="w-full max-w-xs h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 flex items-center justify-between bg-white">
                                            {opt.placeholder} <div className="w-4 h-4 border-2 border-slate-300 rounded-sm border-t-4"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Price Extra */}
                                <div className="w-20 text-right shrink-0">
                                    <span className="text-sm font-bold text-emerald-500">{opt.extra}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"><Settings className="w-4 h-4" /></button>
                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-6 flex justify-between items-center">
                        <button className="bg-indigo-50 text-indigo-600 font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" /> Add Option
                        </button>
                        <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black px-6 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(34,211,238,0.4)] text-sm">
                            Save Configuration
                        </button>
                    </div>

                </div>
            </div>
            
        </div>
    );
}