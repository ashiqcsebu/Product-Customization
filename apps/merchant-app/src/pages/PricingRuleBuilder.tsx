import React, { useState } from 'react';
import { ArrowLeft, GripVertical, Copy, Trash2, Edit2, Sparkles, Check, Info, Settings, Code, Sparkle, ExternalLink, MoreVertical, Plus, Calculator, ChevronDown, ChevronRight, CheckCircle2, BookOpen, PlayCircle, HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component ---
function SortableElement({ id, element, index, onRemove }: { id: string | number, element: any, index: number, onRemove: (id: any) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    const renderIcon = (type: string) => {
        if (type === 'number') return <div className="bg-indigo-600 rounded text-[9px] font-bold text-white px-1.5 py-1">123</div>;
        if (type === 'select') return <div className="bg-emerald-500 rounded p-1 flex items-center justify-center"><ChevronDown className="w-3.5 h-3.5 text-white" /></div>;
        if (type === 'radio') return <div className="bg-blue-500 rounded p-1.5 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>;
        if (type === 'checkbox') return <div className="bg-amber-500 rounded p-1 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>;
        return null;
    }

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm group transition-all">
            <div className="flex items-center gap-3">
                <div {...attributes} {...listeners} className="cursor-grab p-1 text-slate-300 hover:text-slate-500">
                    <GripVertical className="w-4 h-4" />
                </div>
                <div className="w-6 text-[12px] font-medium text-slate-400 text-center">{index + 1}</div>
                <div className="w-8 h-8 rounded-md flex items-center justify-center">
                    {renderIcon(element.type)}
                </div>
                <div>
                    <span className="text-[13px] font-bold text-slate-800">{element.label}</span>
                    <span className="text-[12px] text-slate-400 font-medium ml-3 capitalize tracking-tight">{element.type === 'select' ? 'Dropdown' : element.type}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">
                    <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onRemove(element.id)} className="w-7 h-7 flex items-center justify-center rounded text-rose-500 hover:bg-rose-50">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// --- Main Builder Component ---
export function PricingRuleBuilder() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Core State
    const [name, setName] = useState("Frosted Lettering");
    const [elements, setElements] = useState([
        { id: 'custom-width', type: 'number', label: 'Custom Width', unit: 'in' },
        { id: 'custom-height', type: 'number', label: 'Custom Height', unit: 'in' },
        { id: 'coating', type: 'select', label: 'Coating', options: ['None / Standard'] },
        { id: 'shape', type: 'select', label: 'Shape', options: ['Square / Rectangle'] },
        { id: 'printed-sides', type: 'radio', label: 'Printed Sides', options: ['Single Sided', 'Double Sided'] },
        { id: 'drilled-holes', type: 'checkbox', label: 'Drilled Holes' },
        { id: 'standoffs', type: 'select', label: 'Standoffs', options: ['None'] },
        { id: 'accessories', type: 'select', label: 'Accessories', options: ['None'] },
        { id: 'quantity', type: 'number', label: 'Quantity' },
    ]);

    const [formulaCode, setFormulaCode] = useState(`(shopify_product_price
  + MAX(0, MAX(Custom Width, Shopify_meta_default_width)
  * MAX(Custom Height, Shopify_meta_default_height)
  - Shopify_meta_default_width
  * Shopify_meta_default_height)
  * Shopify_meta_rate
  + Coating
  + Printed Sides
  + Shape
  + Drilled Holes
  + Standoffs
  + Accessories)
  * Quantity`);

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setElements((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addElement = (type: string) => {
        const newEl = {
            id: `el_${Date.now()}`,
            type,
            label: `New ${type}`,
            options: type === 'select' || type === 'radio' ? ['Option 1'] : []
        };
        setElements([...elements, newEl]);
    };

    const removeElement = (idToRemove: string) => {
        setElements(elements.filter(e => e.id !== idToRemove));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-800">
            {/* Topbar */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/pricing')} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        Calculator
                        <span className="bg-[#D1FAE5] text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Live</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                        Preview on store
                    </button>
                    <button className="h-9 px-5 rounded-lg bg-[#4F46E5] hover:bg-indigo-700 text-white text-[13px] font-bold shadow-sm transition-colors">
                        Save calculator
                    </button>
                    <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="max-w-[1440px] mx-auto px-6 pt-6 flex items-start gap-6">

                {/* Left Workspace Column */}
                <div className="flex-1 space-y-6">

                    {/* Calculator Details */}
                    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Calculator className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[15px] font-bold text-slate-900 mb-4">Calculator details</h2>

                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Calculator name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-[13px] font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <div className="flex items-center gap-2 mt-4 text-[13px]">
                                <a href="#" className="font-semibold text-indigo-600 hover:underline">View version history</a>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-slate-500 ml-2">Compare versions</span>
                                <Info className="w-4 h-4 text-slate-900 cursor-pointer ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Elements Builder */}
                    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-[15px] font-bold text-slate-900">Elements</h2>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 text-[13px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-3 py-2 hover:bg-indigo-100 transition-colors">
                                    <Sparkles className="w-4 h-4" />
                                    Create with AI
                                </button>
                                <button onClick={() => addElement('number')} className="flex items-center justify-center text-[13px] font-bold border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors text-slate-700">
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    Add element
                                </button>
                            </div>
                        </div>
                        <p className="text-[13px] text-slate-500 mb-5">Drag and drop to reorder</p>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={elements} strategy={verticalListSortingStrategy}>
                                <div className="space-y-1">
                                    {elements.map((el, index) => (
                                        <SortableElement key={el.id} id={el.id} element={el} index={index} onRemove={removeElement} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Formula Editor */}
                    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200">
                        <div className="flex items-center border-b border-slate-200">
                            <button className="flex-1 py-4 text-[13px] font-bold text-indigo-600 border-b-2 border-indigo-600">Formula</button>
                            <button className="flex-1 py-4 text-[13px] font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent">Products</button>
                            <button className="flex-1 py-4 text-[13px] font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent">Other pages</button>
                            <button className="flex-1 py-4 text-[13px] font-medium text-slate-500 hover:text-slate-800 border-b-2 border-transparent">Settings</button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-[15px] font-bold text-slate-900">Build your formula</h3>
                                    <p className="text-[13px] text-slate-500 mt-1">Use variables, operators and functions to calculate the price.</p>
                                </div>
                                <button className="flex items-center gap-2 h-8 px-3 rounded bg-white text-[12px] font-bold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50">
                                    <Code className="w-3.5 h-3.5" /> Insert variable
                                </button>
                            </div>

                            <div className="bg-[#FFFBF2] rounded-lg border border-[#FDE68A] p-4 font-mono text-[13px] leading-6 text-slate-800 relative shadow-inner overflow-hidden flex">
                                {/* Simulated Line Numbers */}
                                <div className="text-right pr-4 text-slate-400 select-none border-r border-[#FDE68A] mr-4 flex flex-col pt-0.5">
                                    {formulaCode.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
                                </div>
                                <textarea
                                    className="w-full bg-transparent resize-none outline-none whitespace-pre"
                                    value={formulaCode}
                                    onChange={e => setFormulaCode(e.target.value)}
                                    rows={13}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4 pb-6 border-b border-slate-100">
                                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-indigo-50 text-[13px] font-bold text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition">
                                    <Sparkles className="w-4 h-4" /> Write my formula
                                </button>
                                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-[13px] font-bold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50">
                                    <CheckCircle2 className="w-4 h-4" /> Check formula
                                </button>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-[14px] font-bold text-slate-900 mb-4">Formula settings</h3>
                                <div className="grid grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Formula label</label>
                                        <input type="text" defaultValue="Price" className="w-full h-10 text-[13px] border border-slate-300 rounded-lg px-3 focus:outline-none focus:border-indigo-400" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Prefix</label>
                                        <input type="text" defaultValue="$" className="w-full h-10 text-[13px] border border-slate-300 rounded-lg px-3 focus:outline-none focus:border-indigo-400" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Suffix</label>
                                        <input type="text" defaultValue="USD" className="w-full h-10 text-[13px] border border-slate-300 rounded-lg px-3 focus:outline-none focus:border-indigo-400" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Minimum value</label>
                                        <input type="number" defaultValue="0" className="w-full h-10 text-[13px] border border-slate-300 rounded-lg px-3 focus:outline-none focus:border-indigo-400" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Decimals</label>
                                        <select className="w-full h-10 text-[13px] border border-slate-300 rounded-lg px-3 outline-none appearance-none bg-white font-medium bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_10px_center] bg-no-repeat focus:border-indigo-400">
                                            <option>2</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-5 p-4 bg-indigo-50 rounded-lg flex items-center gap-3 text-[13px] text-indigo-700 font-medium border border-indigo-100">
                                    <Info className="w-4 h-4 shrink-0" />
                                    The calculated price will be rounded to 2 decimal places.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Sticky Sidebar */}
                <div className="w-[380px] shrink-0 space-y-6 sticky top-24">

                    {/* Live Preview Display */}
                    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-900">Live preview</h3>
                                <p className="text-[12px] text-slate-500 mt-0.5">This is how it appears on your store.</p>
                            </div>
                            <span className="bg-[#D1FAE5] text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Live</span>
                        </div>

                        <div className="p-6 bg-[#F8FAFC]">
                            <div className="bg-white rounded-[24px] shadow-sm border border-indigo-100 p-6 space-y-5 ring-[6px] ring-indigo-50/50">

                                {elements.map((el) => (
                                    <div key={el.id}>
                                        <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800 mb-2">
                                            {el.label}
                                            {el.type !== 'checkbox' && el.type !== 'radio' && <Info className="w-3 h-3 text-slate-400" />}
                                        </label>

                                        {el.type === 'number' && (
                                            <div className="relative">
                                                <input type="number" defaultValue="72" className="w-full h-11 px-3 border border-slate-200 rounded-lg text-[14px]" />
                                                {el.unit && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-slate-400 border-l border-slate-200 pl-3">{el.unit}</div>}
                                            </div>
                                        )}

                                        {el.type === 'select' && (
                                            <select className="w-full h-11 px-3 border border-slate-200 rounded-lg text-[14px] bg-white outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:18px_18px] bg-[right_12px_center] bg-no-repeat">
                                                {el.options?.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        )}

                                        {el.type === 'radio' && (
                                            <div className="space-y-2">
                                                {el.options?.map((opt, i) => (
                                                    <label key={opt} className="flex items-center gap-2">
                                                        <input type="radio" name={el.id} defaultChecked={i === 0} className="w-4 h-4 accent-indigo-600 border-slate-300" />
                                                        <span className="text-[13px] text-slate-700">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {el.type === 'checkbox' && (
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                                                <span className="text-[13px] text-slate-700">{el.label}</span>
                                            </label>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-8 pt-4">
                                    <p className="text-[13px] font-bold text-slate-800 mb-1">Estimated price</p>
                                    <p className="text-[32px] font-black tracking-tight text-slate-900">$0.00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deployment Card */}
                    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[15px] font-bold text-slate-900">Deployment</h3>
                            <span className="bg-[#D1FAE5] text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">3/3 completed</span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
                            <div className="bg-indigo-600 h-1.5 rounded-full w-full"></div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-[#D1FAE5] rounded-full p-0.5 shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">Build your calculator</p>
                                    <p className="text-[12px] text-slate-500">Design and configure your calculator</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-[#D1FAE5] rounded-full p-0.5 shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">Enable app embed</p>
                                    <p className="text-[12px] text-slate-500">Activate the calculator on your store</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-[#D1FAE5] rounded-full p-0.5 shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">Choose where it appears</p>
                                    <p className="text-[12px] text-slate-500">Select pages to display the calculator</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-lg h-10 text-[13px] font-bold mb-3 shadow flex items-center justify-center gap-2 transition-colors">
                            <ExternalLink className="w-4 h-4" /> View on your store
                        </button>

                        <div className="text-center">
                            <a href="#" className="flex items-center justify-center gap-1.5 text-[#4F46E5] hover:underline text-[13px] font-semibold">
                                <ExternalLink className="w-3.5 h-3.5" /> Customize design
                            </a>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="pt-2">
                        <h3 className="text-[14px] font-bold text-slate-900 mb-1">Need help?</h3>
                        <p className="text-[13px] text-slate-500 mb-4">Learn how to create powerful calculators.</p>

                        <div className="space-y-3">
                            <a href="#" className="flex items-center justify-between text-[#4F46E5] hover:underline text-[13px] font-medium group">
                                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-400 group-hover:text-[#4F46E5]" /> Documentation</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" className="flex items-center justify-between text-[#4F46E5] hover:underline text-[13px] font-medium group">
                                <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-indigo-400 group-hover:text-[#4F46E5]" /> Video tutorials</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <a href="#" className="flex items-center justify-between text-[#4F46E5] hover:underline text-[13px] font-medium group">
                                <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-400 group-hover:text-[#4F46E5]" /> Contact support</span>
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
