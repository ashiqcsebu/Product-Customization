import { Filter, LayoutTemplate, Plus, Search, MoreVertical, Copy, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export function TemplatesPage() {
    const templates = [
        { id: 1, name: "Premium Apparel", type: "T-Shirt", applyTo: "12 Products", lastUpdated: "Today", thumbnail: "👕", size: "1280x1280px" },
        { id: 2, name: "Wrap Canvas (Landscape)", type: "Canvas", applyTo: "5 Products", lastUpdated: "2 days ago", thumbnail: "🖼️", size: "24x36 in" },
        { id: 3, name: "Business Card Standard", type: "Paper", applyTo: "1 Product", lastUpdated: "1 week ago", thumbnail: "💳", size: "3.5x2 in" },
        { id: 4, name: "Ceramic Mug 11oz", type: "Mug", applyTo: "8 Products", lastUpdated: "Jul 10", thumbnail: "☕", size: "8.5x3 in" },
    ];

    return (
        <div className="h-full bg-[#f8fafc] flex flex-col p-8 overflow-y-auto w-full custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Design Templates</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage reusable print areas, masks, and canvass configurations.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-bold shadow-sm transition">
                    <Plus className="w-4 h-4" /> Create Template
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">
                <div className="px-6 py-4 flex gap-4 bg-[#F8FAFC] border-b border-slate-200">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:font-normal shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {templates.map((tpl) => (
                            <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                                <div className="h-40 bg-slate-50 border-b border-slate-200 flex items-center justify-center relative">
                                    <span className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform">{tpl.thumbnail}</span>
                                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                        <button className="px-4 py-2 bg-white text-indigo-700 font-bold text-sm rounded-lg shadow-lg hover:scale-105 transition-transform">Edit Canvas</button>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-extrabold text-slate-800 text-base leading-tight">{tpl.name}</h3>
                                        <button className="text-slate-400 hover:text-slate-800">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-xs font-semibold text-indigo-600 mb-4 bg-indigo-50 inline-block px-2 py-0.5 rounded-md self-start">
                                        {tpl.size}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                                        <span>Applied to {tpl.applyTo}</span>
                                        <span>{tpl.lastUpdated}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
