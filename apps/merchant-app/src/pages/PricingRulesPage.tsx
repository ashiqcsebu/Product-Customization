import { Link } from "react-router-dom";
import { Calculator, Plus } from "lucide-react";

export function PricingRulesPage() {
    return (
        <div className="p-8 h-full bg-slate-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-indigo-600" /> Pricing Rules
                </h2>
                <Link to="/pricing/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Create Rule
                </Link>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col p-10 text-center items-center justify-center">
                <Calculator className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No pricing rules yet</h3>
                <p className="text-slate-500 max-w-sm mb-6">Create advanced dynamic pricing rules, calculations, and conditional logic for your customizable products.</p>
                <Link to="/pricing/new" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 py-2 rounded-md font-medium transition-colors">
                    Build your first rule
                </Link>
            </div>
        </div>
    );
}
