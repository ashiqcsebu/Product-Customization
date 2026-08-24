import React, { useState, useEffect } from 'react';
import { ArrowLeft, Move, Copy, Trash2, Edit2, Sparkles, Check, Info, Settings, Code, LayoutList, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function PricingRuleBuilder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    // Mock Data based on the image
    const [name, setName] = useState("Frosted Lettering");
    const [elements, setElements] = useState([
        { id: 1, type: 'number', label: 'Custom Width', icon: '123' },
        { id: 2, type: 'number', label: 'Custom Height', icon: '123' },
        { id: 3, type: 'select', label: 'Coating', icon: 'dropdown' },
        { id: 4, type: 'select', label: 'Shape', icon: 'dropdown' },
        { id: 5, type: 'radio', label: 'Printed Sides', icon: 'radio' },
        { id: 6, type: 'checkbox', label: 'Drilled Holes', icon: 'checkbox' },
        { id: 7, type: 'select', label: 'Standoffs', icon: 'dropdown' },
        { id: 8, type: 'select', label: 'Accessories', icon: 'dropdown' },
        { id: 9, type: 'number', label: 'Quantity', icon: '123' },
    ]);

    const renderElementIcon = (icon: string) => {
        if (icon === '123') return <div className="text-[10px] font-black border border-slate-300 rounded px-1 text-slate-500 tracking-tighter">123</div>;
        if (icon === 'dropdown') return <div className="w-4 h-3 border-2 border-slate-300 rounded-[3px] flex items-center justify-center after:content-[''] after:w-1.5 after:h-1.5 after:bg-slate-300 after:rounded-sm"></div>;
        if (icon === 'radio') return <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-full flex items-center justify-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-slate-400 before:rounded-full"></div>;
        if (icon === 'checkbox') return <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm flex items-center justify-center"><Check className="w-2.5 h-2.5 text-slate-400" /></div>;
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 px-8 py-5">
                <button onClick={() => navigate('/pricing')} className="text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    Calculator
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">Live</span>
                </h1>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 flex items-start gap-6">

                {/* Left Column */}
                <div className="flex-1 space-y-6">

                    {/* Calculator Name Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Calculator Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
                        />
                        <div className="flex items-center gap-1.5 mt-3 text-[12px]">
                            <a href="#" className="text-blue-600 hover:underline">View version history</a>
                            <span className="text-slate-400">&middot;</span>
                            <span className="text-slate-500">Compare versions</span>
                            <Info className="w-3.5 h-3.5 text-slate-900 cursor-pointer" />
                        </div>
                    </div>

                    {/* Elements Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[15px] font-bold text-slate-900">Elements</h2>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors text-slate-700">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Create with AI
                                </button>
                                <button className="text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors text-slate-700">
                                    + Add element
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {elements.map((el) => (
                                <div key={el.id} className="flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="cursor-grab text-slate-300 hover:text-slate-500">
                                            <Move className="w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                                            {renderElementIcon(el.icon)}
                                        </div>
                                        <span className="text-[13px] text-slate-700">{el.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Formula & Settings Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex items-center border-b border-slate-200 px-5 pt-5 pb-0 gap-6">
                            <button className="flex items-center gap-2 pb-3 border-b-2 border-slate-800 text-[13px] font-semibold text-slate-900">
                                <Circle className="w-3.5 h-3.5 fill-slate-800 text-slate-800" /> Formula
                            </button>
                            <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-[13px] text-slate-500 hover:text-slate-700">
                                <Circle className="w-3.5 h-3.5 text-slate-400" /> Products
                            </button>
                            <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-[13px] text-slate-500 hover:text-slate-700">
                                <Circle className="w-3.5 h-3.5 text-slate-400" /> Other pages
                            </button>
                            <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-[13px] text-slate-500 hover:text-slate-700">
                                <Circle className="w-3.5 h-3.5 text-slate-400" /> Settings
                            </button>
                        </div>

                        <div className="p-5">
                            <h3 className="text-[14px] font-bold text-slate-900">Formula</h3>
                            <p className="text-[12px] text-slate-500 mt-0.5 mb-3">Click the box to see everything you can use — use ↑↓ to navigate, Enter or Tab to apply.</p>

                            <textarea
                                className="w-full h-32 border border-slate-300 rounded-lg p-3 text-[13px] font-mono text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 resize-none whitespace-pre-wrap"
                                defaultValue={`(shopify_product_price + MAX(0, MAX(Custom Width, Shopify_meta_default_width) * MAX(Custom Height, Shopify_meta_default_height) - Shopify_meta_default_width * Shopify_meta_default_height) * Shopify_meta_rate + Coating + Printed Sides + Shape + Drilled Holes + Standoffs + Accessories)`}
                            />

                            <div className="flex items-center justify-between mt-3 mb-6">
                                <button className="flex items-center gap-1.5 text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors text-slate-700">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Write my formula
                                </button>
                                <button className="text-[13px] font-medium border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors text-slate-700">
                                    Check formula
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[12px] text-slate-700 mb-1.5">Formula Label</label>
                                    <input type="text" defaultValue="Price" className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-slate-700 mb-1.5">Formula Prefix</label>
                                    <input type="text" defaultValue="$" className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-slate-700 mb-1.5">Formula Suffix</label>
                                    <input type="text" defaultValue="USD" className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-slate-700 mb-1.5">Minimum Formula Value</label>
                                    <input type="number" defaultValue="0" className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-slate-700 mb-1.5">Formula Decimals</label>
                                    <input type="number" defaultValue="2" className="w-full text-[13px] border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="w-[360px] xl:w-[400px] shrink-0 space-y-6">

                    {/* Visual Preview */}
                    <div className="bg-white rounded-[2rem] shadow-sm border-[8px] border-slate-200/50 p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-1 text-[13px] font-bold text-slate-900 mb-1.5">
                                    Custom Width <Info className="w-3.5 h-3.5 text-slate-700" />
                                </label>
                                <input type="number" defaultValue="72" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-slate-400" />
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-[13px] font-bold text-slate-900 mb-1.5">
                                    Custom Height <Info className="w-3.5 h-3.5 text-slate-700" />
                                </label>
                                <input type="number" defaultValue="36" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-slate-400" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-900 mb-1.5">Coating</label>
                                <select className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] outline-none appearance-none bg-white font-medium bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_8px_center] bg-no-repeat">
                                    <option>None / Standard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-900 mb-1.5">Shape</label>
                                <select className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] outline-none appearance-none bg-white font-medium bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_8px_center] bg-no-repeat">
                                    <option>Square / Rectangle</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-900 mb-1.5">Printed Sides</label>
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-[13px] text-slate-700 font-medium">
                                        <input type="radio" checked className="w-4 h-4 accent-blue-600" />
                                        Single Sided
                                    </label>
                                    <label className="flex items-center gap-2 text-[13px] text-slate-700 font-medium whitespace-nowrap">
                                        <input type="radio" className="w-4 h-4 accent-blue-600" />
                                        Double Sided
                                    </label>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-2 text-[13px] text-slate-700 font-medium">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                                    Drilled Holes
                                </label>
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-900 mt-2 mb-1.5">Standoffs</label>
                                <select className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] outline-none appearance-none bg-white font-medium bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_8px_center] bg-no-repeat">
                                    <option>None</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-slate-900 mt-2 mb-1.5">Accessories</label>
                                <select className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-[13px] outline-none appearance-none bg-white font-medium bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_8px_center] bg-no-repeat">
                                    <option>None</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-[13px] font-bold text-slate-900 mb-1.5 mt-2">
                                    Quantity <Info className="w-3.5 h-3.5 text-slate-700" />
                                </label>
                                <input type="number" defaultValue="1" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-slate-400" />
                            </div>

                            <div className="pt-4 mt-4 mb-2">
                                <label className="block text-[13px] font-bold text-slate-900 mb-1">Price</label>
                                <div className="text-[28px] font-black tracking-tight text-slate-900">$ 0.00</div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-bold text-slate-900">Get your calculator live</h3>
                            <span className="bg-[#A7F3D0] text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-medium">Live on your store</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-2">
                            <span>3/3 completed</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5">
                            <div className="bg-[#60A5FA] h-1.5 rounded-full w-full"></div>
                        </div>

                        <div className="space-y-3 mb-5 text-[13px] text-slate-700">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-900 text-white" />
                                <span>Build your calculator</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-900 text-white" />
                                <span>Enable the app embed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-900 text-white" />
                                <span>Choose where it appears</span>
                            </div>
                        </div>

                        <button className="w-full bg-[#2B2B2B] hover:bg-black text-white rounded-lg py-2.5 text-[13px] font-bold mb-3 shadow-md transition-all">
                            View it on your store
                        </button>

                        <div className="text-center">
                            <a href="#" className="text-[#3B82F6] hover:underline text-[13px] font-medium">Customize design</a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
