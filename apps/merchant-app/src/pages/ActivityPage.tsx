import { Activity, Clock, Box, FileText, Settings, CreditCard, RefreshCw } from "lucide-react";

export function ActivityPage() {
    const activities = [
        { id: 1, type: "product", message: "Synced 40 products from Shopify", time: "10 mins ago", icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-50" },
        { id: 2, type: "rule", message: "Created Pricing Rule 'Canvas Size Multiplier'", time: "2 hours ago", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: 3, type: "template", message: "Modified Template 'Premium Apparel'", time: "Yesterday", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
        { id: 4, type: "settings", message: "Updated Global Store Theme Colors", time: "Jul 15, 2026", icon: Settings, color: "text-slate-500", bg: "bg-slate-100" },
    ];

    return (
        <div className="h-full bg-[#f8fafc] flex flex-col p-8 overflow-y-auto w-full custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Activity Logs
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Track all recent updates and sync operations in your store.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-[#F8FAFC]">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" /> Recent Actions
                    </h2>
                </div>
                <div className="p-6">
                    <div className="relative border-l-2 border-indigo-100 ml-4 py-2 space-y-8">
                        {activities.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.id} className="flex relative items-start gap-6">
                                    {/* Timeline dot */}
                                    <div className={`absolute -left-[35px] top-0 w-12 h-12 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center ${item.bg} ${item.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="ml-8 pt-1">
                                        <p className="font-bold text-slate-800 text-base">{item.message}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-slate-500">
                                            <Clock className="w-3.5 h-3.5" /> {item.time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
