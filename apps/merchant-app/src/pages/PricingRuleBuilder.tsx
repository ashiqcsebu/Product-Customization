import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ChevronRight, Settings, Sliders, DollarSign, Waypoints, Target, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const STEPS = [
    { id: 1, title: 'Template Info', icon: <Settings className="w-4 h-4" /> },
    { id: 2, title: 'Parameters', icon: <Sliders className="w-4 h-4" /> },
    { id: 3, title: 'Option Pricing', icon: <DollarSign className="w-4 h-4" /> },
    { id: 4, title: 'Logic Rules', icon: <Waypoints className="w-4 h-4" /> },
    { id: 5, title: 'Formula', icon: <Target className="w-4 h-4" /> },
];

export function PricingRuleBuilder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Core state
    const [templateData, setTemplateData] = useState<any>({
        name: '',
        description: '',
        industry: 'Signage',
        productType: 'Banner',
        status: 'active',
        minimumPrice: 0,
        parameters: [],
        rules: [],
        formula: ''
    });

    const addParameter = (type: string) => {
        const newParam = {
            id: `param_${Date.now()}`,
            label: 'New Parameter',
            type,
            required: false,
            options: type === 'dropdown' ? [{ label: 'Option 1', value: 'opt1' }] : []
        };
        setTemplateData({ ...templateData, parameters: [...templateData.parameters, newParam] });
    };

    const removeParameter = (id: string) => {
        setTemplateData({ ...templateData, parameters: templateData.parameters.filter((p: any) => p.id !== id) });
    };

    useEffect(() => {
        if (isEditing) {
            fetch(`/api/v1/pricing-templates/${id}`)
                .then(r => r.json())
                .then(data => setTemplateData(data))
                .catch(() => navigate('/pricing'));
        }
    }, [id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const url = isEditing ? `/api/v1/pricing-templates/${id}` : '/api/v1/pricing-templates';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templateData)
            });

            if (res.ok) {
                navigate('/pricing');
            }
        } catch (error) {
            console.error("Save failed");
        } finally {
            setIsSaving(false);
        }
    };

    // Sub-components for steps would go here.
    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC]">
            {/* Topbar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/pricing')} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-sm font-black text-slate-800">{isEditing ? 'Edit Template' : 'Create Pricing Template'}</h1>
                        <p className="text-[11px] font-bold text-slate-400">Step {currentStep} of {STEPS.length}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-9 px-4 rounded-xl text-slate-500 text-sm font-bold hover:bg-slate-100 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-9 px-5 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bcf] text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-colors opacity-90 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Template'}
                    </button>
                </div>
            </header>

            {/* Stepper & Workspace */}
            <div className="flex flex-1 overflow-hidden">
                {/* Horizontal Stepper (Top Area of Workspace) */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="bg-white border-b border-slate-200 px-8 py-6 shrink-0">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 -z-10" />
                                {STEPS.map((step) => {
                                    const isActive = currentStep === step.id;
                                    const isPassed = currentStep > step.id;
                                    return (
                                        <button
                                            key={step.id}
                                            onClick={() => setCurrentStep(step.id)}
                                            className={`flex flex-col items-center gap-2 bg-white px-2 cursor-pointer group`}
                                        >
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'border-[#6C5CE7] bg-indigo-50 text-[#6C5CE7] shadow-sm' : isPassed ? 'border-[#00b894] bg-[#00b894] text-white' : 'border-slate-100 bg-slate-50 text-slate-400 group-hover:border-slate-200'}`}>
                                                {step.icon}
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'text-[#6C5CE7]' : isPassed ? 'text-[#00b894]' : 'text-slate-400'}`}>
                                                {step.title}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Step Content Area */}
                    <div className="flex-1 p-8">
                        <div className="max-w-4xl mx-auto">

                            {/* Step 1: Info */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                                        <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-indigo-500" />
                                            General Information
                                        </h2>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Template Name *</label>
                                                <input
                                                    type="text"
                                                    value={templateData.name}
                                                    onChange={e => setTemplateData({ ...templateData, name: e.target.value })}
                                                    placeholder="e.g. Premium Banner Calculator"
                                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Industry</label>
                                                    <select
                                                        value={templateData.industry}
                                                        onChange={e => setTemplateData({ ...templateData, industry: e.target.value })}
                                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                                    >
                                                        <option value="Signage">Signage & Print</option>
                                                        <option value="Apparel">Apparel & Textiles</option>
                                                        <option value="Hardware">Hardware & Materials</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Product Type</label>
                                                    <input
                                                        type="text"
                                                        value={templateData.productType}
                                                        onChange={e => setTemplateData({ ...templateData, productType: e.target.value })}
                                                        placeholder="e.g. Vinyl Banner"
                                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Internal Description</label>
                                                <textarea
                                                    value={templateData.description}
                                                    onChange={e => setTemplateData({ ...templateData, description: e.target.value })}
                                                    placeholder="Briefly describe what this pricing template is for..."
                                                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Minimum Global Price ($)</label>
                                                <input
                                                    type="number"
                                                    value={templateData.minimumPrice}
                                                    onChange={e => setTemplateData({ ...templateData, minimumPrice: Number(e.target.value) })}
                                                    placeholder="0.00"
                                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                                />
                                                <p className="text-xs font-semibold text-slate-400 mt-2">If the formula evaluates below this, the price will automatically bump up to this value.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Parameters Builder */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                                <Sliders className="w-5 h-5 text-indigo-500" />
                                                Parameter Builder
                                            </h2>
                                            <p className="text-xs font-semibold text-slate-500 mt-1">Add Dynamic Inputs (Width, Height, Dropdowns)</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => addParameter('number')} className="h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">+ Number</button>
                                            <button onClick={() => addParameter('dropdown')} className="h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">+ Dropdown</button>
                                            <button onClick={() => addParameter('checkbox')} className="h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">+ Checkbox</button>
                                        </div>
                                    </div>

                                    {templateData.parameters.length === 0 ? (
                                        <div className="bg-white rounded-3xl p-12 border border-slate-200 border-dashed text-center">
                                            <Sliders className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-black text-slate-800">No Parameters Added</h3>
                                            <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto mt-2">Use the buttons above to add fields that customers will fill out on the product page.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {templateData.parameters.map((param: any, idx: number) => (
                                                <div key={param.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={param.label}
                                                                    onChange={(e) => {
                                                                        const newParams = [...templateData.parameters];
                                                                        newParams[idx].label = e.target.value;
                                                                        setTemplateData({ ...templateData, parameters: newParams });
                                                                    }}
                                                                    className="w-full text-sm font-bold bg-transparent border-b border-dashed border-slate-300 pb-1 focus:border-indigo-500 outline-none"
                                                                />
                                                                <div className="text-[10px] uppercase font-black text-slate-400 mt-1 flex items-center gap-2">
                                                                    <span>Type: {param.type}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                    <span>ID: {param.id}</span>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => removeParameter(param.id)} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors">
                                                                <Target className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        {param.type === 'number' && (
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <input type="number" placeholder="Min Value" className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-400" />
                                                                <input type="number" placeholder="Max Value" className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-400" />
                                                                <input type="text" placeholder="Unit (e.g. inch)" className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Option Pricing placeholder */}
                            {currentStep === 3 && (
                                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                                    <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-black text-slate-800">Option / Variant Pricing</h3>
                                    <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto mt-2">Assign base prices directly to dropdown choices (e.g. Vinyl = $8/sqft)</p>
                                </div>
                            )}

                            {/* Step 4: Logic Rules Placeholder */}
                            {currentStep === 4 && (
                                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                                    <Waypoints className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-black text-slate-800">Conditional Rules</h3>
                                    <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto mt-2">IF Quantity {'>'} 10 THEN Apply 15% discount</p>
                                </div>
                            )}

                            {/* Step 5: Formula Builder */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-2">
                                            <Target className="w-5 h-5 text-indigo-500" />
                                            Formula Engine
                                        </h2>
                                        <p className="text-xs font-semibold text-slate-500 mb-6">Write your mathematical algorithm based on the parameters.</p>

                                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-emerald-400 mb-4 h-32 relative">
                                            <textarea
                                                value={templateData.formula}
                                                onChange={e => setTemplateData({ ...templateData, formula: e.target.value })}
                                                placeholder="(base_price + (width * height * material_rate)) * quantity"
                                                className="w-full h-full bg-transparent resize-none outline-none placeholder:text-slate-700"
                                            />
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2">Available Variables</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-bold text-slate-600">base_price</span>
                                                {templateData.parameters.map((p: any) => (
                                                    <span key={p.id} onClick={() => setTemplateData({ ...templateData, formula: templateData.formula + `[${p.id}]` })} className="px-2 py-1 bg-indigo-50 cursor-pointer hover:bg-indigo-100 rounded text-xs font-mono font-bold text-indigo-600">
                                                        [{p.id}]
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nav Buttons within content */}
                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                                    className={`h-11 px-6 rounded-xl font-bold text-sm transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                >
                                    Previous Step
                                </button>

                                {currentStep < STEPS.length ? (
                                    <button
                                        onClick={() => setCurrentStep(prev => Math.min(STEPS.length, prev + 1))}
                                        className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
                                    >
                                        Next Step
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSave}
                                        className="h-11 px-8 rounded-xl bg-[#00b894] text-white font-bold text-sm hover:bg-[#00a884] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                    >
                                        <Save className="w-4 h-4" />
                                        Complete & Save
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
