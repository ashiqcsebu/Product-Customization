import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Play, Plus, Trash2, X, Settings, Box, RefreshCw } from "lucide-react";

export function PricingRuleBuilder() {
    return (
        <div className="h-full flex flex-col bg-slate-50 relative min-w-[1280px]">
            {/* Top Toolbar */}
            <header className="h-[60px] bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link to="/pricing" className="text-slate-400 hover:text-slate-800 transition-colors p-1.5 rounded-full hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Create Pricing Rule</h1>
                        <p className="text-[12px] text-slate-500">Create advanced pricing rules for products or collections</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Discard
                    </button>
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                        Save as Draft
                    </button>
                    <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                        Publish Rule
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-6 flex gap-6 items-start">

                {/* Left Side: 6 Sections */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* Row 1: Basic Info, Apply Rule To, Pricing Method */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* 1. Basic Information */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col col-span-1">
                            <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-5">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                                Basic Information
                            </h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Rule Name</label>
                                        <input type="text" className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" defaultValue="Banner Standard Pricing" />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Rule Status</label>
                                        <div className="flex items-center gap-2 h-10">
                                            <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                                                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-700">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Priority</label>
                                    <input type="number" className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" defaultValue={1} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block text-slate-400">Description <span className="font-normal">(Optional)</span></label>
                                    <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none h-20 resize-none text-slate-600" defaultValue="Standard pricing for all banner products based on area, material, finishing and quantity."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* 2. Apply Rule To */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col col-span-1">
                            <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-5">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                                Apply Rule To
                            </h2>
                            <div className="flex border border-slate-200 mx-1 mb-5 rounded-lg overflow-hidden">
                                <button className="flex-1 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50">Product</button>
                                <button className="flex-1 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600">Collection</button>
                                <button className="flex-1 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50">Category</button>
                                <button className="flex-1 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50">Tags</button>
                                <button className="flex-1 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50">All Products</button>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Select Collections</label>
                                <div className="min-h-10 border border-slate-200 rounded-lg p-1.5 flex items-center gap-1.5 flex-wrap">
                                    <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                        Banners <X className="w-3 h-3 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 flex gap-2">
                                <div className="text-indigo-600 mt-0.5">ⓘ</div>
                                <p className="text-xs text-indigo-700 leading-relaxed">This rule will apply to all products in the selected collections unless a product-specific rule overrides it.</p>
                            </div>
                        </div>

                        {/* 3. Pricing Method */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col col-span-1">
                            <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-5">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                                Pricing Method
                            </h2>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Select Pricing Method</label>
                                    <div className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-slate-100 text-slate-500 px-1 rounded text-xs font-bold">ft²</span>
                                            <span className="text-slate-700">Per Square Foot (Area Based)</span>
                                        </div>
                                        <div className="text-slate-400">▼</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Base Currency</label>
                                    <div className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm flex items-center justify-between">
                                        <span className="text-slate-700">USD ($) - US Dollar</span>
                                        <div className="text-slate-400">▼</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Rounding Rule</label>
                                    <div className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm flex items-center justify-between">
                                        <span className="text-slate-700">Round to nearest $0.01</span>
                                        <div className="text-slate-400">▼</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Row 2: Rule Builder spanning full width */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                        <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-5">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">4</span>
                            Rule Builder
                        </h2>

                        <div className="flex gap-6 border-t border-slate-100 pt-5">
                            {/* Variables Sidebar */}
                            <div className="w-64 shrink-0 flex flex-col gap-3">
                                <label className="text-xs font-bold text-slate-800 uppercase tracking-widest">Variables</label>
                                <input type="text" placeholder="Search variables..." className="w-full h-9 border border-slate-200 rounded-lg px-3 text-xs bg-slate-50 outline-none" />

                                <div className="mt-2 flex flex-col gap-1">
                                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer group">
                                        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Box className="w-4 h-4 text-slate-400" /> Dimensions
                                        </div>
                                        <span className="text-slate-400">▲</span>
                                    </div>
                                    <div className="pl-8 flex flex-col gap-1 hidden">
                                        <div className="flex items-center justify-between text-xs text-slate-600 py-1.5 group cursor-pointer">
                                            Width (in, ft, m) <Plus className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-500" />
                                        </div>
                                        {/*... etc ...*/}
                                    </div>
                                    {/* MOCK VISUAL OF DIMENSIONS EXPANDED */}
                                    <div className="pl-6 flex flex-col gap-1 -mt-1 mb-2">
                                        <div className="flex items-center justify-between text-[13px] text-slate-600 py-1.5 px-2 hover:bg-slate-50 rounded group cursor-grab border border-transparent hover:border-slate-200">
                                            Width (in, ft, m) <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] text-slate-600 py-1.5 px-2 hover:bg-slate-50 rounded group cursor-grab border border-transparent hover:border-slate-200">
                                            Height (in, ft, m) <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] text-slate-600 py-1.5 px-2 hover:bg-slate-50 rounded group cursor-grab border border-transparent hover:border-slate-200">
                                            Area (sq in, sq ft) <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-sm text-slate-700 font-medium cursor-pointer">
                                        <div className="flex items-center gap-2"><div className="w-4 text-center font-serif text-slate-400">$</div> Pricing</div><span className="text-slate-400">▼</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-sm text-slate-700 font-medium cursor-pointer">
                                        <div className="flex items-center gap-2"><div className="w-4 text-center font-mono text-slate-400">#</div> Quantity</div><span className="text-slate-400">▼</span>
                                    </div>
                                </div>
                            </div>

                            {/* Builder Canvas */}
                            <div className="flex-1 flex flex-col gap-8">

                                {/* Formula Builder Area */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">Formula Builder <span className="text-slate-400 font-normal">ⓘ</span></label>
                                        <button className="text-indigo-600 text-xs font-semibold hover:underline">Test Formula</button>
                                    </div>
                                    <div className="min-h-24 bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex flex-wrap gap-2 items-center align-middle">
                                        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm shadow-sm font-medium cursor-move">Base Price</div>
                                        <div className="font-mono text-slate-500 font-bold">+</div>
                                        <div className="font-mono text-slate-500 font-bold">(</div>
                                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-sm shadow-sm font-medium cursor-move flex items-center gap-1">Area (sq ft) <X className="w-3 h-3 ml-1 opacity-50" /></div>
                                        <div className="font-mono text-slate-500 font-bold">×</div>
                                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-sm shadow-sm font-medium cursor-move">Price Per Sq Ft</div>
                                        <div className="font-mono text-slate-500 font-bold">)</div>
                                        <div className="font-mono text-slate-500 font-bold">+</div>
                                        <div className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-sm shadow-sm font-medium cursor-move">Material Price</div>
                                        <div className="font-mono text-slate-500 font-bold">+</div>
                                        <div className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded text-sm shadow-sm font-medium cursor-move">Finishing Price</div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mr-2">Available Operators</span>
                                        {['+', '-', '×', '÷', '(', ')'].map(op => (
                                            <button key={op} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded shadow-sm text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors">{op}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conditions Area */}
                                <div>
                                    <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-3">Conditions <span className="text-slate-400 font-normal lowercase tracking-normal">(Optional)</span></label>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16"></div>
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 flex items-center justify-between text-sm text-slate-700">Width (ft) <span className="text-slate-400">▼</span></div>
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 flex items-center justify-between text-sm text-slate-700">Greater Than (&gt;) <span className="text-slate-400">▼</span></div>
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 flex items-center justify-between text-sm text-slate-700">0</div>
                                            <div className="w-12 text-slate-500 text-sm font-medium">ft <span className="text-slate-400 ml-1">▼</span></div>
                                            <button className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 font-semibold text-slate-600 text-sm flex items-center justify-between px-2 bg-slate-100 rounded h-8 border border-slate-200">AND <span className="text-slate-400 text-xs">▼</span></div>
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 flex items-center justify-between text-sm text-slate-700">Height (ft) <span className="text-slate-400">▼</span></div>
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 flex items-center justify-between text-sm text-slate-700">Greater Than (&gt;) <span className="text-slate-400">▼</span></div>
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 flex items-center justify-between text-sm text-slate-700">0</div>
                                            <div className="w-12 text-slate-500 text-sm font-medium">ft <span className="text-slate-400 ml-1">▼</span></div>
                                            <button className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Add Condition</button>
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline"><Plus className="w-4 h-4" /> Add Condition Group</button>
                                    </div>
                                </div>

                                {/* Pricing Components Summary Table */}
                                <div className="mt-4">
                                    <label className="text-xs font-bold text-slate-800 uppercase tracking-widest block mb-3">Pricing Components</label>
                                    <div className="w-full border border-slate-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-2.5 font-medium">Component</th>
                                                    <th className="px-4 py-2.5 font-medium">Type</th>
                                                    <th className="px-4 py-2.5 font-medium">Value</th>
                                                    <th className="px-4 py-2.5 font-medium text-right w-24">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Base Price</td>
                                                    <td className="px-4 py-3 text-slate-600">Fixed</td>
                                                    <td className="px-4 py-3 font-mono text-slate-700">$ 10.00</td>
                                                    <td className="px-4 py-3 flex justify-end gap-2">
                                                        <button className="text-slate-400 hover:text-indigo-600"><Settings className="w-4 h-4" /></button>
                                                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Price Per Sq Ft</td>
                                                    <td className="px-4 py-3 text-slate-600">Per Sq Ft</td>
                                                    <td className="px-4 py-3 font-mono text-slate-700">$ 2.50</td>
                                                    <td className="px-4 py-3 flex justify-end gap-2">
                                                        <button className="text-slate-400 hover:text-indigo-600"><Settings className="w-4 h-4" /></button>
                                                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Material Price</td>
                                                    <td className="px-4 py-3 text-slate-600">Option Based</td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">Based on selection</td>
                                                    <td className="px-4 py-3 flex justify-end gap-2">
                                                        <button className="text-slate-400 hover:text-indigo-600"><Settings className="w-4 h-4" /></button>
                                                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Finishing Price</td>
                                                    <td className="px-4 py-3 text-slate-600">Option Based</td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">Based on selection</td>
                                                    <td className="px-4 py-3 flex justify-end gap-2">
                                                        <button className="text-slate-400 hover:text-indigo-600"><Settings className="w-4 h-4" /></button>
                                                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="bg-white border-t border-slate-200 p-2">
                                            <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 w-full py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1">
                                                <Plus className="w-4 h-4" /> Add Component
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Separator for Layout flow, actually we have Section 5 & 6 under Right side but let's do 2 columns in the right panel */}

                <div className="w-[320px] shrink-0 flex flex-col gap-6">
                    {/* 5. Quantity Pricing */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">5</span>
                                Quantity Pricing
                            </h2>
                            <div className="w-9 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                            <div className="col-span-3">Min Qty</div>
                            <div className="col-span-3">Max Qty</div>
                            <div className="col-span-3">Disc Type</div>
                            <div className="col-span-3">Value</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={1} /></div>
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={5} /></div>
                                <div className="col-span-3 text-[11px] text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 rounded flex items-center justify-center font-medium truncate px-1">No Discount</div>
                                <div className="col-span-2"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={"0%"} /></div>
                                <div className="col-span-1 text-center"><Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-600 inline" /></div>
                            </div>
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={6} /></div>
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={10} /></div>
                                <div className="col-span-3 text-[11px] text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 rounded flex items-center justify-center font-medium truncate px-1">Percentage</div>
                                <div className="col-span-2"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={"5%"} /></div>
                                <div className="col-span-1 text-center"><Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-600 inline" /></div>
                            </div>
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={11} /></div>
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={25} /></div>
                                <div className="col-span-3 text-[11px] text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 rounded flex items-center justify-center font-medium truncate px-1">Percentage</div>
                                <div className="col-span-2"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={"10%"} /></div>
                                <div className="col-span-1 text-center"><Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-600 inline" /></div>
                            </div>
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={26} /></div>
                                <div className="col-span-3"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none font-bold" defaultValue={"\u221E"} /></div>
                                <div className="col-span-3 text-[11px] text-slate-600 text-center bg-slate-50 border border-slate-200 h-8 rounded flex items-center justify-center font-medium truncate px-1">Percentage</div>
                                <div className="col-span-2"><input className="w-full border border-slate-200 rounded h-8 px-2 text-sm text-center outline-none" defaultValue={"15%"} /></div>
                                <div className="col-span-1 text-center"><Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-600 inline" /></div>
                            </div>

                            <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 mt-2 hover:underline w-fit"><Plus className="w-4 h-4" /> Add Tier</button>
                        </div>
                    </div>

                    {/* 6. Limits */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-5">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">6</span>
                            Limits
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Minimum Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                                    <input type="text" className="w-full h-10 border border-slate-200 rounded-lg pl-7 pr-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" defaultValue="25.00" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Maximum Width</label>
                                    <div className="relative">
                                        <input type="text" className="w-full h-10 border border-slate-200 rounded-lg px-3 pr-8 text-sm outline-none" defaultValue="20" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">ft</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Maximum Height</label>
                                    <div className="relative">
                                        <input type="text" className="w-full h-10 border border-slate-200 rounded-lg px-3 pr-8 text-sm outline-none" defaultValue="10" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">ft</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Maximum Area</label>
                                <div className="relative">
                                    <input type="text" className="w-full h-10 border border-slate-200 rounded-lg px-3 pr-10 text-sm outline-none" defaultValue="200" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">sq ft</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Maximum Quantity</label>
                                <input type="text" className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm outline-none" defaultValue="1000" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: LIVE PREVIEW SIDEBAR */}
                <div className="w-[320px] shrink-0 bg-white rounded-xl shadow-lg border border-slate-200 p-5 sticky top-24">
                    <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                        <h2 className="flex items-center gap-2 font-bold text-slate-800">
                            <EyeIcon className="w-4 h-4 text-indigo-600" /> Live Price Preview
                        </h2>
                        <button className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline"><RefreshCw className="w-3 h-3" /> Reset</button>
                    </div>

                    <div className="mb-5">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Enter Values</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-slate-600 w-16">Width</label>
                                <div className="flex-1 relative">
                                    <input type="text" className="w-full h-9 border border-slate-200 rounded-lg px-2 text-sm bg-slate-50 outline-none" defaultValue="6" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">ft</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-slate-600 w-16">Height</label>
                                <div className="flex-1 relative">
                                    <input type="text" className="w-full h-9 border border-slate-200 rounded-lg px-2 text-sm bg-slate-50 outline-none" defaultValue="4" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">ft</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-slate-600 w-16">Quantity</label>
                                <div className="flex-1">
                                    <input type="text" className="w-full h-9 border border-slate-200 rounded-lg px-2 text-sm bg-slate-50 outline-none" defaultValue="10" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                                <label className="text-xs font-semibold text-slate-600">Material</label>
                                <div className="w-full h-9 border border-slate-200 rounded-lg px-2 text-sm flex items-center justify-between text-slate-700 bg-slate-50">
                                    Premium Vinyl (+$10.00) <span className="text-slate-400 text-xs">▼</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-600">Finishing</label>
                                <div className="w-full h-9 border border-slate-200 rounded-lg px-2 text-sm flex items-center justify-between text-slate-700 bg-slate-50">
                                    Grommets (+$5.00) <span className="text-slate-400 text-xs">▼</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Price Breakdown</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Base Price</span>
                                <span>$10.00</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Area (24 sq ft) × $2.50</span>
                                <span>$60.00</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Material: Premium Vinyl</span>
                                <span>$10.00</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-medium">
                                <span>Finishing: Grommets</span>
                                <span>$5.00</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 pt-2 mb-2">
                            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                                <span>Subtotal</span>
                                <span>$85.00</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-emerald-600">
                                <span>Quantity Discount (5%)</span>
                                <span>-$4.25</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-slate-800">Total Price</span>
                            <span className="text-2xl font-black text-indigo-700 tracking-tight">$80.75</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 p-2 bg-indigo-50/50 border border-indigo-100 rounded text-xs text-indigo-600 font-medium">
                        ⓘ Area: 24 sq ft (6 × 4)
                    </div>
                </div>

            </div>
        </div>
    );
}

// Inline EyeIcon since we didn't import it at top
function EyeIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
    );
}
