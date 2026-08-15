import { useState } from "react";
import { Plus, Trash2, Save, Settings2, X, PlusCircle, ChevronDown, Box } from "lucide-react";

type Choice = { id: string; label: string; priceModifier: number; isPercentage: boolean };
type OptionType = "dropdown" | "radio" | "checkbox" | "swatch" | "text" | "file";

type ProductOption = {
    id: string;
    type: OptionType;
    name: string;
    label: string;
    required: boolean;
    choices: Choice[];
};

export function ProductOptionsBuilder() {
    const [selectedProduct, setSelectedProduct] = useState("prod_1");

    const [options, setOptions] = useState<ProductOption[]>([
        {
            id: "opt_1",
            type: "dropdown",
            name: "Material",
            label: "Select Material",
            required: true,
            choices: [
                { id: "c1", label: "Standard Cotton", priceModifier: 0, isPercentage: false },
                { id: "c2", label: "Premium Silk", priceModifier: 15, isPercentage: false },
            ]
        }
    ]);

    const addOption = () => {
        if (options.length >= 10) {
            alert("Maximum 10 options allowed per product.");
            return;
        }
        setOptions([
            ...options,
            {
                id: Date.now().toString(),
                type: "dropdown",
                name: "New Option",
                label: "Select Option",
                required: false,
                choices: []
            }
        ]);
    };

    const removeOption = (id: string) => {
        setOptions(options.filter(o => o.id !== id));
    };

    const updateOption = (id: string, updates: Partial<ProductOption>) => {
        setOptions(options.map(o => o.id === id ? { ...o, ...updates } : o));
    };

    const addChoice = (optionId: string) => {
        setOptions(options.map(o => {
            if (o.id === optionId) {
                return {
                    ...o,
                    choices: [...o.choices, { id: Date.now().toString(), label: "New Choice", priceModifier: 0, isPercentage: false }]
                };
            }
            return o;
        }));
    };

    const removeChoice = (optionId: string, choiceId: string) => {
        setOptions(options.map(o => {
            if (o.id === optionId) {
                return { ...o, choices: o.choices.filter(c => c.id !== choiceId) };
            }
            return o;
        }));
    };

    const updateChoice = (optionId: string, choiceId: string, updates: Partial<Choice>) => {
        setOptions(options.map(o => {
            if (o.id === optionId) {
                return {
                    ...o,
                    choices: o.choices.map(c => c.id === choiceId ? { ...c, ...updates } : c)
                };
            }
            return o;
        }));
    };

    const handleSave = () => {
        console.log("Saving Options:", options);
        alert("Product Options & Add-On Rules Saved Successfully!");
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] text-slate-800 font-sans overflow-hidden">
            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Add-On Options</h1>
                        <p className="text-sm text-slate-500 mt-1">Configure limitless options and variant pricing rules for products.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-slate-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Options
                    </button>
                </div>

                {/* TARGET PRODUCT SELECTION */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Product</label>
                    <div className="relative max-w-md">
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-indigo-500 transition"
                        >
                            <option value="prod_1">Classic T-Shirt</option>
                            <option value="prod_2">Custom Canvas Frame</option>
                            <option value="prod_3">Coffee Mug</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Custom Options ({options.length}/10)</h2>
                    <button
                        onClick={addOption}
                        className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
                    >
                        <Plus className="w-4 h-4" /> Add Option Group
                    </button>
                </div>

                <div className="flex flex-col gap-6 pb-20">
                    {options.map((option, index) => (
                        <div key={option.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Option Header */}
                            <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={option.name}
                                        onChange={(e) => updateOption(option.id, { name: e.target.value })}
                                        className="text-lg font-extrabold text-slate-900 bg-transparent border-none outline-none focus:ring-0 max-w-xs"
                                        placeholder="Option Name"
                                    />
                                    <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden ml-4">
                                        {["dropdown", "radio", "swatch", "text"].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => updateOption(option.id, { type: type as OptionType })}
                                                className={`px-3 py-1.5 text-xs font-bold capitalize transition ${option.type === type ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={option.required}
                                            onChange={(e) => updateOption(option.id, { required: e.target.checked })}
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        Required
                                    </label>
                                    <button onClick={() => removeOption(option.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Option Body (Choices setup) */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Display Label</label>
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => updateOption(option.id, { label: e.target.value })}
                                        className="w-full max-w-md bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                    />
                                </div>

                                {["text", "file"].includes(option.type) ? (
                                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                                        <Settings2 className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-sm font-medium">This is an input field. Rules like extra cost per character can be implemented via Advanced Pricing Formula.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Choices & Pricing Add-ons</label>
                                        </div>

                                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3 font-bold text-slate-700 w-1/2">Choice Label</th>
                                                        <th className="px-4 py-3 font-bold text-slate-700">Price Add-on (+/-)</th>
                                                        <th className="px-4 py-3 w-16"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {option.choices.map((choice) => (
                                                        <tr key={choice.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="text"
                                                                    value={choice.label}
                                                                    onChange={(e) => updateChoice(option.id, choice.id, { label: e.target.value })}
                                                                    className="w-full bg-white border border-slate-200 rounded lg px-3 py-2 outline-none focus:border-indigo-500"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="flex flex-col relative max-w-[150px]">
                                                                    <div className="relative">
                                                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                                                        <input
                                                                            type="number"
                                                                            value={choice.priceModifier}
                                                                            onChange={(e) => updateChoice(option.id, choice.id, { priceModifier: Number(e.target.value) })}
                                                                            className="w-full bg-white border border-slate-200 rounded lg pl-7 pr-3 py-2 outline-none focus:border-indigo-500"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-right">
                                                                <button
                                                                    onClick={() => removeChoice(option.id, choice.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded transition"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="bg-slate-50 p-3 flex justify-center border-t border-slate-200">
                                                <button
                                                    onClick={() => addChoice(option.id)}
                                                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <PlusCircle className="w-4 h-4" /> Add Choice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {options.length === 0 && (
                        <div className="border border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500">
                            <Box className="w-12 h-12 mb-4 text-slate-300" />
                            <h3 className="text-lg font-bold text-slate-700 mb-1">No Custom Options Added</h3>
                            <p className="text-sm text-center max-w-sm mb-6">Create up to 10 custom product options. These will appear on the storefront bypassing Shopify's 3 variant limit.</p>
                            <button onClick={addOption} className="bg-white border border-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm">
                                Create First Option
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}