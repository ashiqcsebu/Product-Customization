import React, { useState, useEffect } from 'react';
import { Settings, Plus, Search, Filter, Box, Edit2, Copy, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PricingTemplatesPage() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch templates from API
        fetch('/api/v1/pricing-templates')
            .then(res => res.json())
            .then(data => {
                setTemplates(data || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pricing Templates</h1>
                        <p className="text-sm font-semibold text-slate-500 mt-1">Manage reusable dynamic pricing algorithms for your products.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/pricing/new')}
                    className="h-10 px-6 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bcf] active:bg-[#4b3eaf] text-white text-sm font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(108,92,231,0.3)] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="bg-slate-50 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium w-full sm:w-64 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder-slate-400"
                        />
                    </div>
                    <button className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
                <div className="text-sm font-bold text-slate-500">
                    Showing {templates.length} templates
                </div>
            </div>

            {/* Empty State */}
            {!isLoading && templates.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Box className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">No Templates Found</h2>
                    <p className="text-sm font-semibold text-slate-500 mb-6 max-w-md mx-auto">You haven't created any pricing templates yet. Create your first template to build powerful dynamic pricing rules.</p>
                    <button
                        onClick={() => navigate('/pricing/new')}
                        className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg transition-all"
                    >
                        Create First Template
                    </button>
                </div>
            )}

            {/* Template List */}
            {templates.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[11px] font-black tracking-wider uppercase text-slate-400 w-1/3">Template Name</th>
                                <th className="px-6 py-4 text-[11px] font-black tracking-wider uppercase text-slate-400">Industry / Type</th>
                                <th className="px-6 py-4 text-[11px] font-black tracking-wider uppercase text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[11px] font-black tracking-wider uppercase text-slate-400">Parameters</th>
                                <th className="px-6 py-4 text-[11px] font-black tracking-wider uppercase text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {templates.map((template) => (
                                <tr key={template._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                <Settings className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">{template.name}</div>
                                                <div className="text-xs font-semibold text-slate-400 line-clamp-1">{template.description || "No description"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            {template.industry || "General"}
                                            {template.productType && <span className="text-slate-400 font-medium">/ {template.productType}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 space-x-1 text-[11px] font-black rounded-md ${template.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : template.status === 'draft'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${template.status === 'active' ? 'bg-emerald-500' : template.status === 'draft' ? 'bg-amber-500' : 'bg-slate-400'
                                                }`} />
                                            <span className="uppercase">{template.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block">
                                            {template.parameters?.length || 0} Params
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => navigate(`/pricing/${template._id}`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
