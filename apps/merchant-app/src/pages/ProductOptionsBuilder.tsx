import { useState } from "react";
import { ArrowLeft, GripVertical, Settings2, Trash2, Plus, ChevronDown } from "lucide-react";

type Choice = { id: string; label: string; priceModifier: number };
type ProductOption = {
    id: string;
    type: "Color Swatch" | "Dropdown" | "Button" | "Radio" | "File Upload";
    name: string;
    label: string;
    required: boolean;
    showLabel: boolean;
    helpText: string;
    layout: "Vertical" | "Horizontal" | "Swatch Grid" | "Pill";
    choices: Choice[];
};

export function ProductOptionsBuilder() {
    const [activeTab, setActiveTab] = useState("Options");

    // Core functional state matching the image structure exactly
    const [options, setOptions] = useState<ProductOption[]>([
        {
            id: "opt_color",
            name: "Color",
            label: "Color",
            type: "Color Swatch",
            required: true,
            showLabel: true,
            helpText: "Choose your preferred color",
            layout: "Vertical",
            choices: [
                { id: "c_black", label: "Black", priceModifier: 0 },
                { id: "c_white", label: "White", priceModifier: 0 },
                { id: "c_blue", label: "Blue", priceModifier: 2 },
                { id: "c_red", label: "Red", priceModifier: 0 },
                { id: "c_gray", label: "Gray", priceModifier: 0 },
            ]
        },
        {
            id: "opt_size",
            name: "Size",
            label: "Size",
            type: "Dropdown",
            required: true,
            showLabel: true,
            helpText: "",
            layout: "Vertical",
            choices: [
                { id: "s_s", label: "S", priceModifier: 0 },
                { id: "s_m", label: "M", priceModifier: 0 },
                { id: "s_l", label: "L", priceModifier: 4 },
            ]
        },
        {
            id: "opt_loc",
            name: "Print Location",
            label: "Print Location",
            type: "Button",
            required: false,
            showLabel: true,
            helpText: "",
            layout: "Horizontal",
            choices: [
                { id: "l_front", label: "Front", priceModifier: 0 },
                { id: "l_back", label: "Back", priceModifier: 5 },
                { id: "l_chest", label: "Left Chest", priceModifier: -2 },
            ]
        }
    ]);

    const [selectedOptionId, setSelectedOptionId] = useState<string>("opt_color");
    const activeOption = options.find(o => o.id === selectedOptionId);

    // Live preview mock states
    const [previewSelections, setPreviewSelections] = useState<Record<string, string>>({
        opt_color: "c_black",
        opt_size: "s_m",
        opt_loc: "l_front",
    });

    const addOption = () => {
        if (options.length >= 10) {
            alert("Maximum 10 options reached.");
            return;
        }
        const newId = "opt_" + Date.now();
        setOptions([...options, {
            id: newId,
            name: "New Option",
            label: "New Option Label",
            type: "Dropdown",
            required: false,
            showLabel: true,
            helpText: "",
            layout: "Horizontal",
            choices: []
        }]);
        setSelectedOptionId(newId);
    };

    const updateActiveOption = (updates: Partial<ProductOption>) => {
        if (!activeOption) return;
        setOptions(options.map(o => o.id === activeOption.id ? { ...o, ...updates } : o));
    };

    const removeOption = (id: string) => {
        const newOptions = options.filter(o => o.id !== id);
        setOptions(newOptions);
        if (selectedOptionId === id) setSelectedOptionId(newOptions[0]?.id || "");
    };

    // Derived calculated price
    const basePrice = 22.00;
    let extraPrice = 0;
    options.forEach(opt => {
        const selectedValue = previewSelections[opt.id];
        const choice = opt.choices.find(c => c.id === selectedValue);
        if (choice) {
            extraPrice += choice.priceModifier;
        }
    });

    const badgeColors: Record<string, string> = {
        "Color Swatch": "bg-blue-500",
        "Dropdown": "bg-amber-500",
        "Button": "bg-cyan-500",
        "Radio": "bg-red-500",
        "File Upload": "bg-emerald-500"
    };

    const handleSave = () => {
        alert("Settings Saved successfully! Sending full JSON to Shopify.");
        console.log("Config:", options);
    };

    return (
        <div className="flex-1 overflow-auto bg-[#F8FAFC] text-slate-800 font-sans p-8 max-w-[1400px] w-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:text-slate-800 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        Polo Shirt
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">Active</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-slate-50 transition">
                        Preview Store
                    </button>
                    <button onClick={handleSave} className="bg-[#6C5CE7] hover:bg-indigo-600 text-white font-bold px-5 py-2 rounded-lg text-sm shadow-sm transition">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar">
                {["Overview", "Options", "Option Values", "Variants", "Pricing", "Conditions", "Display", "Preview"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold transition whitespace-nowrap border-b-2 ${activeTab === tab ? 'border-[#6C5CE7] text-[#6C5CE7]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Options" && (
                <div className="flex flex-col gap-8">

                    {/* Options Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Options</h2>
                                <p className="text-sm text-slate-500">Manage product options and their settings</p>
                            </div>
                            <button onClick={addOption} className="flex items-center gap-2 bg-[#6C5CE7] text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-indigo-600 transition">
                                <Plus className="w-4 h-4" /> Add Option
                            </button>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[13px]">
                                    <tr>
                                        <th className="p-4 w-12 text-center"></th>
                                        <th className="p-4">Option</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4 text-center">Values</th>
                                        <th className="p-4 text-center">Required</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {options.map((opt) => (
                                        <tr key={opt.id} onClick={() => setSelectedOptionId(opt.id)} className={`border-b border-slate-100 hover:bg-slate-50/50 transition cursor-pointer ${selectedOptionId === opt.id ? 'bg-indigo-50/30' : ''}`}>
                                            <td className="p-4 text-center"><GripVertical className="w-4 h-4 text-slate-300 inline cursor-grab" /></td>
                                            <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded ${badgeColors[opt.type] || "bg-slate-500"} flex items-center justify-center text-white text-[10px]`}>
                                                    <Settings2 className="w-3 h-3" />
                                                </div>
                                                {opt.name}
                                            </td>
                                            <td className="p-4 text-slate-600 text-[13px]">{opt.type}</td>
                                            <td className="p-4 text-center font-bold text-slate-600">{opt.choices.length || '-'}</td>
                                            <td className="p-4 text-center font-medium text-slate-800">{opt.required ? 'Yes' : 'No'}</td>
                                            <td className="p-4 text-center">
                                                <div className="w-10 h-5 bg-[#6C5CE7] rounded-full mx-auto relative">
                                                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-1 top-0.5"></div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center text-slate-400">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button className="hover:text-slate-600 transition"><Settings2 className="w-4 h-4" /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); removeOption(opt.id); }} className="hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Option Settings Form */}
                    {activeOption && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Option Settings ({activeOption.name})</h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Option Label</label>
                                        <input type="text" value={activeOption.label} onChange={e => updateActiveOption({ label: e.target.value, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#6C5CE7]" />
                                    </div>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="mt-0.5"><input type="checkbox" checked={activeOption.required} onChange={e => updateActiveOption({ required: e.target.checked })} className="w-4 h-4 rounded text-[#6C5CE7] border-slate-300 focus:ring-[#6C5CE7]" /></div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800">Required Option</span>
                                            <span className="block text-[13px] text-slate-500">Customer must select a value</span>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="mt-0.5"><input type="checkbox" checked={activeOption.showLabel} onChange={e => updateActiveOption({ showLabel: e.target.checked })} className="w-4 h-4 rounded text-[#6C5CE7] border-slate-300 focus:ring-[#6C5CE7]" /></div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800">Show Option Label</span>
                                            <span className="block text-[13px] text-slate-500">Show label on the product page</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Option Type</label>
                                        <div className="relative">
                                            <select value={activeOption.type} onChange={e => updateActiveOption({ type: e.target.value as any })} className="appearance-none w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-[#6C5CE7] bg-white">
                                                <option>Color Swatch</option>
                                                <option>Dropdown</option>
                                                <option>Button</option>
                                                <option>Radio</option>
                                                <option>File Upload</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Help Text (Optional)</label>
                                        <input type="text" value={activeOption.helpText} onChange={e => updateActiveOption({ helpText: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#6C5CE7]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Option Layout</label>
                                        <div className="flex items-center gap-3">
                                            {["Vertical", "Horizontal", "Swatch Grid", "Pill"].map(lay => (
                                                <div
                                                    key={lay}
                                                    onClick={() => updateActiveOption({ layout: lay as any })}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-bold cursor-pointer transition ${activeOption.layout === lay ? 'border-[#6C5CE7] text-[#6C5CE7] bg-indigo-50/50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {activeOption.layout === lay && <span className="w-3.5 h-3.5 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center text-[8px] mr-1">✓</span>}
                                                    {activeOption.layout !== lay && <span className="w-3.5 h-3.5 rounded-full border border-slate-300 mr-1"></span>}
                                                    {lay}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition mb-8">
                                <span className="text-sm font-bold text-slate-800">Advanced Settings (Price Multipliers & Logic)</span>
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            </div>

                            {/* Live Preview Container directly linked to state */}
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-inner relative">
                                <div className="px-6 py-3 border-b border-[#E2E8F0] flex items-center justify-between text-indigo-600 bg-white">
                                    <span className="text-sm font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Live Store Preview</span>
                                    <span className="text-xs font-bold underline cursor-pointer hover:text-indigo-800">View Full Preview</span>
                                </div>
                                <div className="p-8 pb-12">
                                    <div className="flex gap-12 flex-wrap">
                                        {options.map(opt => (
                                            <div key={opt.id} className="flex flex-col gap-2">
                                                {opt.showLabel && <span className="text-sm font-bold text-slate-800">{opt.label} {opt.required && <span className="text-red-500">*</span>}</span>}
                                                {opt.helpText && <span className="text-[11px] text-slate-500 -mt-1">{opt.helpText}</span>}

                                                {/* Render dynamic UI per type */}
                                                {opt.type === "Color Swatch" && (
                                                    <div className="flex gap-2">
                                                        {opt.choices.map(c => (
                                                            <div
                                                                key={c.id}
                                                                onClick={() => setPreviewSelections({ ...previewSelections, [opt.id]: c.id })}
                                                                title={`${c.label} (+ $${c.priceModifier})`}
                                                                style={{ backgroundColor: c.label.toLowerCase() }}
                                                                className={`w-8 h-8 rounded-full border border-slate-200 cursor-pointer ${previewSelections[opt.id] === c.id ? `ring-2 ring-offset-2 ring-black` : 'hover:ring-2 ring-offset-2 ring-slate-200'}`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                )}

                                                {opt.type === "Dropdown" && (
                                                    <div className="relative w-32">
                                                        <select
                                                            value={previewSelections[opt.id] || ""}
                                                            onChange={e => setPreviewSelections({ ...previewSelections, [opt.id]: e.target.value })}
                                                            className="appearance-none w-full border border-slate-300 rounded bg-white px-3 py-1.5 text-sm font-medium outline-none cursor-pointer"
                                                        >
                                                            {opt.choices.map(c => (
                                                                <option key={c.id} value={c.id}>{c.label} {c.priceModifier ? `(+$${c.priceModifier})` : ''}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                                                    </div>
                                                )}

                                                {opt.type === "Button" && (
                                                    <div className="flex gap-2 text-sm">
                                                        {opt.choices.map(c => (
                                                            <button
                                                                key={c.id}
                                                                onClick={() => setPreviewSelections({ ...previewSelections, [opt.id]: c.id })}
                                                                className={`border font-medium px-4 py-1.5 rounded transition ${previewSelections[opt.id] === c.id ? 'border-[#6C5CE7] text-[#6C5CE7] bg-indigo-50' : 'border-slate-300 text-slate-600 bg-white hover:bg-slate-50'}`}
                                                            >
                                                                {c.label} {c.priceModifier ? `(+$${c.priceModifier})` : ''}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {opt.type === "File Upload" && (
                                                    <input type="file" className="text-sm" />
                                                )}

                                                {opt.type === "Radio" && (
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        {opt.choices.map(c => (
                                                            <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name={`opt_${opt.id}`}
                                                                    checked={previewSelections[opt.id] === c.id}
                                                                    onChange={() => setPreviewSelections({ ...previewSelections, [opt.id]: c.id })}
                                                                /> {c.label}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                    </div>

                                    <div className="mt-12 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
                                        <div className="text-slate-800 font-bold flex items-center gap-2">
                                            Price: <span className="text-2xl text-[#6C5CE7]">${(basePrice + extraPrice).toFixed(2)}</span>
                                        </div>
                                        <button className="bg-[#6C5CE7] hover:bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow transition text-[15px]">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeTab !== "Options" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm text-center">
                    <h2 className="text-lg font-bold text-slate-700">Tab Content placeholder for {activeTab}</h2>
                    <p className="text-slate-500 mt-2">The focus UI for Option Building is located under "Options".</p>
                </div>
            )}
        </div>
    );
}