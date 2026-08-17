import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ChevronRight, ExternalLink, CloudUpload, Edit2, Trash2,
    GripVertical, Plus, X, Box, Settings2, RefreshCw, Eye, Check, ChevronDown,
    Filter, Download, MoreHorizontal, FileText, LayoutTemplate, Copy, Search
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

type IOptionValue = {
    id: string;
    label: string;
    priceModifier: number;
    isDefault: boolean;
};

type IVariantGroup = {
    id: string;
    name: string;
    type: string;
    required: boolean;
    options: IOptionValue[];
    status: 'Active' | 'Inactive'; // Added for the new UI
};

export function ProductEditPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [variants, setVariants] = useState<IVariantGroup[]>([]);

    // New States
    const [useAppVariants, setUseAppVariants] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Pricing Tabs & Combos
    const [pricingTab, setPricingTab] = useState<'Combination' | 'Rules'>('Combination');
    const [combinations, setCombinations] = useState<any[]>([]);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<IVariantGroup | null>(null);

    // Rules
    const [rules, setRules] = useState<any[]>([
        { id: 'rule_base', name: 'Base Price', type: 'Base Price (Fixed)', amount: 20.00, active: true },
        { id: 'rule_2', name: 'Material', type: 'Option Price', amount: 0, active: true },
    ]);
    const [editingRuleId, setEditingRuleId] = useState<string | null>('rule_base');

    useEffect(() => {
        // Fetch Product Info
        fetch(`${API_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                fetchConfig();
            })
            .catch(err => console.error(err));
    }, [id]);

    const fetchConfig = () => {
        fetch(`${API_URL}/products/${id}/config`)
            .then(res => res.json())
            .then(data => {
                if (data.options && data.options.length > 0) {
                    setVariants(data.options);
                }
                if (data.combinations && data.combinations.length > 0) setCombinations(data.combinations);
                if (data.pricingRules && data.pricingRules.length > 0) setRules(data.pricingRules);
                if (data.useAppVariants !== undefined) setUseAppVariants(data.useAppVariants);
            });
    };

    const handleSave = () => {
        setIsSaving(true);
        fetch(`${API_URL}/products/${id}/config`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                options: variants,
                combinations,
                pricingRules: rules,
                useAppVariants,
            })
        })
            .then(res => res.json())
            .then(data => {
                setIsSaving(false);
                alert("Changes saved explicitly!");
            })
            .catch(() => {
                setIsSaving(false);
            });
    };

    const openDrawer = (variant?: IVariantGroup) => {
        if (variant) {
            setEditingVariant(JSON.parse(JSON.stringify(variant))); // Deep copy for editing safely
        } else {
            setEditingVariant({
                id: `var_${Date.now()}`,
                name: "",
                type: "Buttons",
                required: false,
                status: "Active",
                options: []
            });
        }
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setEditingVariant(null), 300); // Wait for transition
    };

    const saveDrawerVariant = () => {
        if (!editingVariant || !editingVariant.name) {
            alert("Variant name is required");
            return;
        }

        const existingIdx = variants.findIndex(v => v.id === editingVariant.id);
        if (existingIdx >= 0) {
            const newVariants = [...variants];
            newVariants[existingIdx] = editingVariant;
            setVariants(newVariants);
        } else {
            if (variants.length >= 10) return alert("Max 10 variants allowed.");
            setVariants([...variants, editingVariant]);
        }
        closeDrawer();
    };

    const deleteVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id));
    };

    const deleteOption = (variantId: string, optionId: string) => {
        setVariants(variants.map(v => {
            if (v.id === variantId) {
                return { ...v, options: v.options.filter(o => o.id !== optionId) };
            }
            return v;
        }));
    };

    const generateCombinations = () => {
        if (variants.length === 0) return;

        const optionsPerVariant = variants.map(v =>
            v.options.map(o => ({ variantId: v.id, variantName: v.name, ...o }))
        ).filter(arr => arr.length > 0);

        if (optionsPerVariant.length === 0) {
            setCombinations([]);
            return;
        }

        const cartesian = (a: any[], b: any[]) => a.flatMap(d => b.map(e => [...(Array.isArray(d) ? d : [d]), e]));

        let result = optionsPerVariant[0].map(o => [o]);
        for (let i = 1; i < optionsPerVariant.length; i++) {
            result = cartesian(result, optionsPerVariant[i]);
        }

        const newCombinations = result.map((comboArray: any[]) => {
            const skuPart = comboArray.map(c => c.label.substring(0, 3).toUpperCase()).join('-');
            return {
                id: comboArray.map(c => c.id).join('-'),
                selection: comboArray,
                price: 25.00,
                sku: `BAN-${skuPart}`,
                status: "Active"
            };
        });

        setCombinations(newCombinations);
    };

    // Helper for Drawer to edit options
    const updateEditingOption = (optId: string, field: keyof IOptionValue, value: any) => {
        if (!editingVariant) return;
        setEditingVariant({
            ...editingVariant,
            options: editingVariant.options.map(o => o.id === optId ? { ...o, [field]: value } : o)
        });
    };

    return (
        <div className="h-full bg-[#f6f6f8] flex flex-col p-6 overflow-y-auto w-full relative font-sans text-slate-800">
            <div className="max-w-[1400px] mx-auto w-full">

                {/* Top Breadcrumbs */}
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500 mb-5">
                    <Link to="/products" className="hover:text-slate-800 transition">Products</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <Link to="/products" className="hover:text-slate-800 transition">All Products</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800">{product?.title || "Custom Banner"}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800">Edit Product</span>
                </div>

                {/* Main Action Header */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product?.image?.src ? (
                                <img src={product.image.src} alt="Product" className="w-full h-full object-cover" />
                            ) : (
                                <Box className="w-6 h-6 text-indigo-400" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-xl font-bold text-slate-900 leading-none">{product?.title || "Custom Banner"}</h1>
                                <span className="bg-emerald-100 text-emerald-700 border border-emerald-200/50 text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Active</span>
                            </div>
                            <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
                                <span>Shopify Product ID: <a href="#" className="text-indigo-600 hover:underline">gid://shopify/Product/{product?.id || "1234567890"}</a> <ExternalLink className="inline w-3 h-3 ml-0.5" /></span>
                                <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 text-emerald-500" /> Last Synced: Today, 3:42 PM <span className="text-emerald-600 font-bold ml-1">✓ Synced</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={fetchConfig} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition">Discard Changes</button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-bold hover:bg-indigo-100 transition"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-5 py-2 bg-[#1b5dfc] text-white rounded-lg text-sm font-bold shadow-sm shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 transition"
                        >
                            <CloudUpload className="w-4 h-4" /> {isSaving ? "Syncing..." : "Publish & Sync to Shopify"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                    {/* Left Column (Main Config) */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* App Variants Activation Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start justify-between">
                            <div className="max-w-[60%]">
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-base font-bold text-slate-900">Use App Variants</h2>
                                    {/* Tailwind Toggle Switch */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={useAppVariants} onChange={e => setUseAppVariants(e.target.checked)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1b5dfc]"></div>
                                    </label>
                                </div>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                    When enabled, this product will use the app's variant and pricing system on the live store instead of Shopify default product options.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" /> App Variant Active
                                </span>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" /> Live Store Synced
                                </span>
                            </div>
                        </div>

                        {/* Variants Management Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">Product Variants <span className="text-slate-400 border border-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-help">?</span></h2>
                                    <p className="text-[13px] text-slate-500 font-medium mt-1">Create and manage custom options for this product. Maximum 10 variants and 20 options per variant.</p>
                                </div>
                                <button
                                    onClick={() => openDrawer()}
                                    className="px-4 py-2 text-indigo-700 bg-white border border-indigo-200 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 flex items-center gap-1.5 transition"
                                >
                                    <Plus className="w-4 h-4" /> Add Variant
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 w-16">#</th>
                                            <th className="px-6 py-3">Variant Name</th>
                                            <th className="px-6 py-3">Display Type</th>
                                            <th className="px-6 py-3">Options</th>
                                            <th className="px-6 py-3">Required</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {variants.map((v, i) => (
                                            <tr key={v.id} className="hover:bg-slate-50/50 transition">
                                                <td className="px-6 py-3 text-slate-400 font-medium">{i + 1}</td>
                                                <td className="px-6 py-3 font-semibold text-slate-800">{v.name}</td>
                                                <td className="px-6 py-3 text-slate-600">
                                                    <div className="inline-flex items-center justify-between min-w-[120px] px-3 py-1.5 border border-slate-200 bg-white rounded text-[13px] font-medium shadow-sm">
                                                        {v.type}
                                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 font-medium text-slate-600">{v.options.length}</td>
                                                <td className="px-6 py-3">
                                                    {v.required ? (
                                                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded font-bold text-[12px]">Required</span>
                                                    ) : (
                                                        <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded font-bold text-[12px]">Optional</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-emerald-600 font-bold text-[13px]">{v.status}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                                        <button onClick={() => openDrawer(v)} className="p-1.5 hover:text-indigo-600 hover:bg-slate-100 rounded transition"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => deleteVariant(v.id)} className="p-1.5 hover:text-rose-600 hover:bg-slate-100 rounded transition"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {variants.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-medium">No variants added yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-500 flex justify-between uppercase tracking-wide">
                                <span>Total Variants: {variants.length} of 10</span>
                                <span>Total Options: {variants.reduce((acc, v) => acc + v.options.length, 0)} of 80</span>
                            </div>
                        </div>

                        {/* Pricing Complete Feature (Phase 3 & 4) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
                            {/* Tabs */}
                            <div className="border-b border-slate-200 flex">
                                <button onClick={() => setPricingTab('Combination')} className={`px-6 py-4 font-bold text-sm flex-1 lg:flex-none text-center transition ${pricingTab === 'Combination' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
                                    Combination Pricing
                                </button>
                                <button onClick={() => setPricingTab('Rules')} className={`px-6 py-4 font-bold text-sm flex-1 lg:flex-none text-center transition ${pricingTab === 'Rules' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
                                    Pricing Rules
                                </button>
                            </div>

                            {pricingTab === 'Combination' && (
                                <div className="p-0">
                                    <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-800 mb-1">Combination Pricing</h2>
                                            <p className="text-[12px] text-slate-500">Set price for each possible combination of variant options.</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={generateCombinations} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-100 flex items-center gap-1.5 transition">
                                                <RefreshCw className="w-3.5 h-3.5" /> Generate Combinations
                                            </button>
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition">
                                                <Edit2 className="w-3.5 h-3.5" /> Bulk Edit
                                            </button>
                                            <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-4 flex items-center justify-between">
                                        <div className="flex gap-2 w-full max-w-md">
                                            <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-sm font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 shadow-sm"><Filter className="w-3.5 h-3.5" /> Filters</button>
                                            <div className="relative flex-1">
                                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                <input type="text" placeholder="Search combinations..." className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:border-indigo-500 font-medium shadow-sm bg-white" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-slate-800">Total Combinations: {combinations.length}</span>
                                            <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-sm font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 shadow-sm"><Download className="w-3.5 h-3.5" /> Export</button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto border-t border-slate-200">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-[#f8fafc] text-slate-500 font-bold border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                                                    {variants.map(v => (
                                                        <th key={v.id} className="px-4 py-3">{v.name}</th>
                                                    ))}
                                                    <th className="px-4 py-3">SKU</th>
                                                    <th className="px-4 py-3">Price</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {combinations.slice(0, 10).map((combo) => (
                                                    <tr key={combo.id} className={`hover:bg-slate-50 ${combo.status === 'Inactive' ? 'opacity-50' : ''}`}>
                                                        <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-300" /></td>
                                                        {combo.selection.map((sel: any, i: number) => (
                                                            <td key={i} className="px-4 py-3 font-semibold text-slate-800">{sel.label}</td>
                                                        ))}
                                                        <td className="px-4 py-3 text-slate-500">
                                                            <input
                                                                type="text"
                                                                value={combo.sku}
                                                                onChange={(e) => setCombinations(combinations.map(c => c.id === combo.id ? { ...c, sku: e.target.value } : c))}
                                                                className="w-24 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded px-2 py-1 text-sm bg-transparent outline-none transition"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="relative w-24">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                                                <input
                                                                    type="number"
                                                                    value={combo.price}
                                                                    onChange={(e) => setCombinations(combinations.map(c => c.id === combo.id ? { ...c, price: Number(e.target.value) } : c))}
                                                                    className="w-full border border-slate-200 rounded text-sm font-bold pl-7 pr-2 py-1.5 text-slate-800 focus:border-indigo-500 outline-none transition"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={combo.status === 'Active'}
                                                                    onChange={(e) => setCombinations(combinations.map(c => c.id === combo.id ? { ...c, status: e.target.checked ? 'Active' : 'Inactive' } : c))}
                                                                />
                                                                <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#1b5dfc]"></div>
                                                            </label>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                                                <button
                                                                    onClick={() => setCombinations([
                                                                        ...combinations.slice(0, combinations.findIndex(c => c.id === combo.id) + 1),
                                                                        { ...combo, id: combo.id + '_copy' },
                                                                        ...combinations.slice(combinations.findIndex(c => c.id === combo.id) + 1)
                                                                    ])}
                                                                    className="p-1 hover:text-indigo-600 transition" title="Duplicate"><Copy className="w-4 h-4" /></button>
                                                                <button
                                                                    onClick={() => setCombinations(combinations.filter(c => c.id !== combo.id))}
                                                                    className="p-1 hover:text-rose-600 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {combinations.length === 0 && (
                                                    <tr><td colSpan={variants.length + 5} className="py-12 text-center text-slate-400 font-medium">Click "Generate Combinations" based on variants to start setting prices.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {combinations.length > 0 && (
                                        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-[12px] font-bold text-slate-500 bg-white">
                                            <span>Showing 1 to {Math.min(10, combinations.length)} of {combinations.length} combinations</span>
                                            <div className="flex gap-1">
                                                <button className="px-2.5 py-1 text-indigo-600 border border-indigo-200 bg-indigo-50 rounded">1</button>
                                                <button className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded">2</button>
                                                <button className="px-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded">3</button>
                                                <span className="px-2">...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {pricingTab === 'Rules' && (
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium mb-4">Create rules to calculate price automatically based on base price and option values.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-1.5 transition"><Plus className="w-4 h-4" /> Add Rule</button>
                                            <button className="px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition"><FileText className="w-4 h-4" /> Preview Calculation</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50 rounded-xl border border-slate-100 p-4">
                                        {/* Rules List */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                            <div className="p-3 bg-slate-50/50 border-b border-slate-200 font-bold text-sm text-slate-800">Rules ({rules.length})</div>
                                            <div className="divide-y divide-slate-100 flex-1">
                                                {rules.map((rule, idx) => (
                                                    <div key={rule.id} onClick={() => setEditingRuleId(rule.id)} className={`p-3 flex items-center justify-between cursor-pointer ${editingRuleId === rule.id ? 'bg-indigo-50/50 border-l-2 border-l-indigo-600' : 'hover:bg-slate-50'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                                                            <div>
                                                                <div className={`font-bold text-[13px] ${editingRuleId === rule.id ? 'text-indigo-800' : 'text-slate-700'}`}>{rule.name}</div>
                                                                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{rule.type}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <label className="relative inline-flex items-center cursor-pointer scale-[0.8] origin-right" onClick={e => e.stopPropagation()}>
                                                                <input type="checkbox" className="sr-only peer" checked={rule.active} onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, active: e.target.checked } : r))} />
                                                                <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#1b5dfc]"></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => {
                                                const newRule = { id: `rule_${Date.now()}`, name: 'New Rule', type: 'Option Price', amount: 0, active: true };
                                                setRules([...rules, newRule]);
                                                setEditingRuleId(newRule.id);
                                            }} className="p-3 text-indigo-600 text-sm font-bold flex items-center justify-center gap-1.5 border-t border-slate-100 hover:bg-slate-50 transition"><Plus className="w-3.5 h-3.5" /> Add Rule</button>
                                        </div>

                                        {/* Active Rule Editor */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">Edit Rule</h3>

                                            {rules.find(r => r.id === editingRuleId) ? (() => {
                                                const currentRule = rules.find(r => r.id === editingRuleId);
                                                return (<>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Rule Type</label>
                                                            <select
                                                                value={currentRule?.type}
                                                                onChange={e => setRules(rules.map(r => r.id === editingRuleId ? { ...r, type: e.target.value } : r))}
                                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-600 outline-none appearance-none font-semibold text-slate-800 bg-slate-50"
                                                            >
                                                                <option>Base Price (Fixed)</option>
                                                                <option>Option Price</option>
                                                                <option>Calculation based</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Rule Name</label>
                                                            <input
                                                                type="text"
                                                                value={currentRule?.name}
                                                                onChange={e => setRules(rules.map(r => r.id === editingRuleId ? { ...r, name: e.target.value } : r))}
                                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-600 outline-none font-semibold text-slate-800 bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Amount</label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                                                <input
                                                                    type="number"
                                                                    value={currentRule?.amount}
                                                                    onChange={e => setRules(rules.map(r => r.id === editingRuleId ? { ...r, amount: Number(e.target.value) } : r))}
                                                                    className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-indigo-600 outline-none font-bold text-slate-800 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-[12px] font-semibold text-indigo-800 flex items-start gap-2">
                                                        <div className="mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                                                        This rule calculates price based on selected options and variants.
                                                    </div>

                                                    <div className="mt-6 flex justify-end">
                                                        <button onClick={() => {
                                                            setRules(rules.filter(r => r.id !== editingRuleId));
                                                            setEditingRuleId(null);
                                                        }} className="text-rose-600 hover:text-rose-700 text-sm font-bold px-3 py-1.5 rounded hover:bg-rose-50 transition">Delete Rule</button>
                                                    </div>
                                                </>);
                                            })() : (
                                                <div className="py-10 text-center text-slate-400 font-medium">Select a rule to edit</div>
                                            )}
                                        </div>

                                        {/* Calculation Preview */}
                                        <div className="bg-[#f8fafc] rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
                                            <h3 className="font-bold text-slate-800 text-sm mb-4">Calculation Preview</h3>

                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between text-[13px] font-bold">
                                                    <span className="text-slate-600">Base Price</span>
                                                    <span className="text-slate-900">$20.00</span>
                                                </div>
                                                <div className="flex justify-between text-[13px] font-bold">
                                                    <span className="text-slate-600">Material: Mesh</span>
                                                    <span className="text-slate-500">+$5.00</span>
                                                </div>
                                                <div className="flex justify-between text-[13px] font-bold">
                                                    <span className="text-slate-600">Finishing: Pole Pocket</span>
                                                    <span className="text-slate-500">+$8.00</span>
                                                </div>
                                                <div className="flex justify-between text-[13px] font-bold text-rose-600">
                                                    <span>Quantity: 25 (Tier: 25-49)</span>
                                                    <span>-$3.00</span>
                                                </div>
                                                <div className="flex justify-between text-[13px] font-bold">
                                                    <span className="text-slate-600">Area: 3 x 6 ft (18 sq.ft &times; $2.50)</span>
                                                    <span className="text-slate-500">+$45.00</span>
                                                </div>
                                                <div className="flex justify-between text-[13px] font-bold text-rose-600 pb-3 border-b border-slate-200">
                                                    <span>Large Area Discount (Area &gt; 20 sq.ft)</span>
                                                    <span>-$2.00</span>
                                                </div>

                                                <div className="flex justify-between pt-2">
                                                    <span className="font-black text-slate-900">Total Price</span>
                                                    <span className="font-black text-xl text-slate-900">$73.00</span>
                                                </div>
                                            </div>

                                            <p className="text-[11px] text-slate-400 font-medium mt-4">This preview is an example. Final price may vary.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column (Preview & Meta) */}
                    <div className="space-y-6">

                        {/* Live Store Preview */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Eye className="w-4 h-4 text-slate-500" /> Live Store Preview</h3>
                                <ExternalLink className="w-4 h-4 text-slate-400 cursor-pointer hover:text-indigo-600" />
                            </div>
                            <div className="p-5">
                                <h4 className="text-lg font-bold text-slate-900 mb-4">{product?.title || "Custom Banner"}</h4>

                                {variants.map(v => (
                                    <div key={v.id} className="mb-4">
                                        <div className="text-[13px] font-bold text-slate-800 mb-1.5">{v.name}</div>
                                        {v.type === 'Dropdown' ? (
                                            <div className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 flex justify-between items-center bg-white cursor-pointer">
                                                <span>{v.options[0]?.label || "Select..."}</span>
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {v.options.map((o, idx) => (
                                                    <div key={o.id} className={`px-4 py-1.5 border rounded-md text-sm font-medium cursor-pointer transition ${idx === 0 ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                                                        {o.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-5 mb-2">
                                    <div className="text-[13px] font-bold text-slate-800 mb-1.5">Price</div>
                                    <div className="text-2xl font-black text-slate-900">$25.00</div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <div className="border border-slate-300 rounded-md px-3 py-2 flex items-center justify-between w-24 font-semibold text-slate-800">
                                        <span className="text-slate-400 cursor-pointer">-</span>
                                        <span>1</span>
                                        <span className="text-slate-400 cursor-pointer">+</span>
                                    </div>
                                    <button className="flex-1 bg-[#1b5dfc] text-white font-bold rounded-md hover:bg-blue-700 transition">Add to Cart</button>
                                </div>
                            </div>
                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-medium text-center">
                                Preview reflects current app configuration.
                            </div>
                        </div>

                        {/* Shopify Sync panel */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Settings2 className="w-4 h-4 text-slate-500" /> Shopify Sync</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Status</span>
                                    <span className="text-emerald-600 bg-emerald-50 px-2 rounded text-xs font-bold border border-emerald-100 flex items-center gap-1"><Check className="w-3 h-3" /> Connected</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Last Sync</span>
                                    <span className="text-slate-800 font-semibold">Today, 3:42 PM</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Changes</span>
                                    <span className="text-amber-600 font-bold">3 pending changes</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#1b5dfc] text-white text-sm font-bold py-2 rounded-lg hover:bg-blue-700 shadow-sm">Sync Now</button>
                                <button className="flex-1 bg-white border border-slate-200 text-slate-600 text-sm font-bold py-2 rounded-lg hover:bg-slate-50">View History</button>
                            </div>
                        </div>

                        {/* Product Settings panel */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Settings2 className="w-4 h-4 text-slate-500" /> Product Settings</h3>

                            <div className="space-y-4 mb-4">
                                {["Enable App Pricing", "Sync automatically", "Show price on variant selection", "Allow quantity selection", "Show SKU to customer"].map((set, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">{set}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={i !== 4} />
                                            <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#1b5dfc]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex justify-between w-full items-center">
                                    View All Settings <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Slide-out Drawer for Variant Edit */}
            {/* Overlay */}
            <div className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeDrawer} />

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-[460px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Drawer Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">{editingVariant?.id.startsWith('var_') && Date.now() - parseInt(editingVariant.id.split('_')[1]) < 100000 ? "Add Variant" : "Edit Variant"}</h2>
                    <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition"><X className="w-5 h-5" /></button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {editingVariant && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Variant Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-slate-900 font-semibold"
                                    value={editingVariant.name}
                                    placeholder="e.g. Material"
                                    onChange={e => setEditingVariant({ ...editingVariant, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Display Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none appearance-none font-semibold text-slate-800 bg-white"
                                        value={editingVariant.type}
                                        onChange={e => setEditingVariant({ ...editingVariant, type: e.target.value })}
                                    >
                                        <option value="Dropdown">Dropdown</option>
                                        <option value="Buttons">Buttons</option>
                                        <option value="Pills">Pills</option>
                                        <option value="Color Swatches">Color Swatches</option>
                                        <option value="Image Swatches">Image Swatches</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <label className="text-sm font-bold text-slate-800">Required</label>
                                    <p className="text-[12px] text-slate-500">Customer must select an option.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={editingVariant.required} onChange={e => setEditingVariant({ ...editingVariant, required: e.target.checked })} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1b5dfc]"></div>
                                </label>
                            </div>

                            <div>
                                <div className="flex justify-between flex-end mb-3">
                                    <label className="block text-sm font-bold text-slate-800">Options</label>
                                    <span className="text-xs font-semibold text-slate-400">{editingVariant.options.length} of 20 options used</span>
                                </div>

                                <div className="space-y-2">
                                    {editingVariant.options.map((opt, i) => (
                                        <div key={opt.id} className="flex gap-2 group">
                                            <div className="mt-2 text-slate-300 cursor-grab hover:text-slate-500"><GripVertical className="w-4 h-4" /></div>
                                            <div className="flex-1 flex flex-col gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50 relative">
                                                <input
                                                    type="text"
                                                    className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 font-semibold text-slate-800"
                                                    placeholder="Option Name"
                                                    value={opt.label}
                                                    onChange={e => updateEditingOption(opt.id, 'label', e.target.value)}
                                                />
                                                <button onClick={() => setEditingVariant({ ...editingVariant, options: editingVariant.options.filter(o => o.id !== opt.id) })} className="absolute top-2 right-2 p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            if (editingVariant.options.length >= 20) return;
                                            setEditingVariant({ ...editingVariant, options: [...editingVariant.options, { id: `opt_${Date.now()}`, label: "New Option", priceModifier: 0, isDefault: false }] })
                                        }}
                                        className="w-full py-2.5 border border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-1.5 mt-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Option
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                    <button onClick={closeDrawer} className="flex-1 py-2.5 border border-slate-300 bg-white text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition shadow-sm">Cancel</button>
                    <button onClick={saveDrawerVariant} className="flex-1 py-2.5 bg-[#1b5dfc] text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm">Save Variant</button>
                </div>
            </div>

        </div>
    );
}
