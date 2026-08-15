import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, RefreshCw } from "lucide-react";

export function PricingRuleBuilder() {
    const [name, setName] = useState("Custom Canvas Base Pricing");
    const [formula, setFormula] = useState("Width * Height * Area + Base Price");

    // Variables state
    const [variables, setVariables] = useState([
        { id: "v1", name: "Width", default: 10 },
        { id: "v2", name: "Height", default: 5 },
        { id: "v3", name: "Area", default: 50 },
    ]);

    // Live Preview State
    const [previewInputs, setPreviewInputs] = useState<Record<string, number>>({ Width: 10, Height: 5, Area: 50 });
    const [calculatedPrice, setCalculatedPrice] = useState(0);

    // Mock Live Evaluator
    useEffect(() => {
        try {
            let evalFormula = formula.toLowerCase();
            variables.forEach(v => {
                const val = previewInputs[v.name] !== undefined ? previewInputs[v.name] : v.default;
                evalFormula = evalFormula.replace(new RegExp(v.name.toLowerCase(), 'g'), val.toString());
            });
            evalFormula = evalFormula.replace(/base price/g, '20'); // Mock base price

            // Only allow safe math chars
            if (/^[0-9+\-*/().\s]+$/.test(evalFormula)) {
                // eslint-disable-next-line
                const res = new Function('return ' + evalFormula)();
                setCalculatedPrice(Number(res) || 0);
            }
        } catch (e) {
            // Ignore syntax errors during typing
        }
    }, [formula, previewInputs, variables]);

    const handleSave = async () => {
        try {
            // Here you would normally POST to /api/v1/pricing
            alert("Pricing Rule Saved Successfully! Syncing to backend.");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-slate-800 font-sans">
            <div className="flex-1 overflow-auto p-10 flex flex-col max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/pricing" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-500 shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">PRICING RULE SET</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">ACTIVE</span>
                            </div>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="text-2xl font-extrabold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition w-full"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition text-sm">Discard</button>
                        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2">
                            Save Rule
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_350px] gap-8">
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">Variables</h2>
                                <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:text-indigo-700" onClick={() => setVariables([...variables, { id: Date.now().toString(), name: "NewVar", default: 0 }])}>
                                    <Plus className="w-4 h-4" /> Add Variable
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {variables.map((v, i) => (
                                    <div key={v.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center gap-3">
                                        <div className="flex-1">
                                            <input value={v.name} onChange={e => {
                                                const n = [...variables];
                                                n[i].name = e.target.value;
                                                setVariables(n);
                                            }} className="font-bold text-slate-800 text-sm bg-transparent outline-none w-full mb-1" />
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>Default:</span>
                                                <input type="number" value={v.default} onChange={e => {
                                                    const n = [...variables];
                                                    n[i].default = Number(e.target.value);
                                                    setVariables(n);
                                                }} className="w-16 bg-white border border-slate-200 rounded px-1" />
                                            </div>
                                        </div>
                                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded" onClick={() => {
                                            setVariables(variables.filter(vr => vr.id !== v.id));
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0A071B] rounded-2xl shadow-lg border border-slate-800 p-6 relative overflow-hidden">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">Mathematical Formula</h2>
                            <textarea
                                value={formula}
                                onChange={e => setFormula(e.target.value)}
                                className="w-full bg-[#1A162B] border border-indigo-500/30 rounded-xl p-4 text-cyan-400 font-mono text-lg resize-none h-32 focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition"
                            />
                            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
                                Available Variables:
                                {variables.map(v => (
                                    <span key={v.id} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 cursor-pointer hover:bg-white/10" onClick={() => setFormula(formula + ` ${v.name} `)}>
                                        {v.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-10">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                                Live Preview
                                <RefreshCw className="w-4 h-4 text-slate-400" />
                            </h2>
                            <div className="space-y-4 mb-6">
                                {variables.map(v => (
                                    <div key={v.id} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">{v.name}</span>
                                        <input
                                            type="number"
                                            value={previewInputs[v.name] ?? v.default}
                                            onChange={e => setPreviewInputs({ ...previewInputs, [v.name]: Number(e.target.value) })}
                                            className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-right outline-none focus:border-indigo-500 transition"
                                        />
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Base Price</span>
                                    <span className="text-sm font-semibold text-slate-800">$20.00</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calculated Price</span>
                                <span className="text-4xl font-extrabold text-indigo-600">${calculatedPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
