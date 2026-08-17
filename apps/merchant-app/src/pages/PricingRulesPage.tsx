import { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Plus, Search, MoreVertical, Edit2, Copy, Trash2, ArrowUpDown, Filter, AlertCircle, Percent, DollarSign } from "lucide-react";

export function PricingRulesPage() {
    const [rules, setRules] = useState([
        { id: "1", name: "Canvas Size Multiplier", type: "Formula", status: "Active", appliedTo: "2 Products", lastUpdated: "Today, 10:43 AM" },
        { id: "2", name: "Premium Material Surcharge", type: "Fixed Addition", status: "Active", appliedTo: "All Products", lastUpdated: "Yesterday, 4:12 PM" },
        { id: "3", name: "Wholesale Discount Tier 1", type: "Percentage", status: "Draft", appliedTo: "1 Category", lastUpdated: "Aug 12, 2026" },
        { id: "4", name: "Express Shipping Fee", type: "Fixed Addition", status: "Active", appliedTo: "Cart Level", lastUpdated: "Aug 10, 2026" },
    ]);

    return (
        <div className="p-8 h-full bg-[#F8FAFC] flex flex-col max-w-[1400px] mx-auto w-full">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Calculator className="w-8 h-8 text-indigo-600 p-1.5 bg-indigo-100 rounded-lg" />
                        Pricing Engine
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-2">Manage dynamic pricing algorithms, surcharges, and bulk discounts.</p>
                </div>
                <Link to="/pricing/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow">
                    <Plus className="w-4 h-4 text-indigo-100" /> Create Rule
                </Link>
            </div>

            {/* Smart Toolbar */}
            <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full max-w-md">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search algorithms..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:font-normal"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shrink-0">
                        <Filter className="w-4 h-4 text-slate-400" /> Filter
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-b-xl border border-slate-200 shadow-sm overflow-hidden flex-1 relative">
                <div className="overflow-x-auto h-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                <th className="py-3 px-6 text-xs font-black text-slate-500 tracking-wider uppercase flex items-center gap-1 cursor-pointer hover:text-slate-800">Rule Name <ArrowUpDown className="w-3 h-3" /></th>
                                <th className="py-3 px-6 text-xs font-black text-slate-500 tracking-wider uppercase">Algorithm Type</th>
                                <th className="py-3 px-6 text-xs font-black text-slate-500 tracking-wider uppercase">Status</th>
                                <th className="py-3 px-6 text-xs font-black text-slate-500 tracking-wider uppercase">Applied To</th>
                                <th className="py-3 px-6 text-xs font-black text-slate-500 tracking-wider uppercase">Last Updated</th>
                                <th className="py-3 px-6 text-xs font-black text-slate-500 tracking-wider uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rule.type === 'Formula' ? 'bg-purple-100 text-purple-600' :
                                                    rule.type === 'Percentage' ? 'bg-emerald-100 text-emerald-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {rule.type === 'Formula' && <Calculator className="w-4 h-4" />}
                                                {rule.type === 'Percentage' && <Percent className="w-4 h-4" />}
                                                {rule.type === 'Fixed Addition' && <DollarSign className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 block leading-none mb-1">{rule.name}</span>
                                                <span className="text-xs font-medium text-slate-500">{rule.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{rule.type}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${rule.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                            {rule.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                            {rule.appliedTo}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                        {rule.lastUpdated}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                onClick={() => setRules(rules.filter(r => r.id !== rule.id))}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {rules.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">No active algorithms</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">Configure advanced pricing logics based on user inputs.</p>
                    </div>
                )}
            </div>

            {/* Pagination / Footer */}
            <div className="mt-4 flex items-center justify-between text-sm font-medium text-slate-500">
                <p>Showing {rules.length} algorithms</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Prev</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
}
