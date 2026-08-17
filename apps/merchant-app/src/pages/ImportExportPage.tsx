import { ArrowUpToLine, Download, FileJson, AlertCircle } from "lucide-react";

export function ImportExportPage() {
    return (
        <div className="h-full bg-[#f8fafc] flex flex-col p-8 overflow-y-auto w-full custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Import & Export</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Backup your configurations, templates, and pricing rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                        <Download className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Export Data</h2>
                    <p className="text-sm font-medium text-slate-500 mb-6">Download a complete JSON backup of your current print templates, options, and conditional pricing rules.</p>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition">
                        <FileJson className="w-4 h-4" /> Generate Backup
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition relative overflow-hidden">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <ArrowUpToLine className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Import Data</h2>
                    <p className="text-sm font-medium text-slate-500 mb-6">Restore your configurations from a previously exported JSON backup file. This will override existing rules.</p>

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 relative group cursor-pointer hover:bg-slate-100 transition">
                        <ArrowUpToLine className="w-6 h-6 text-slate-400 mb-2 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-600">Click to upload JSON file</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".json" />
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-amber-600 bg-amber-50 p-2 rounded-lg">
                        <AlertCircle className="w-4 h-4" /> This action cannot be undone.
                    </div>
                </div>
            </div>
        </div>
    );
}
