import { useEffect, useState } from 'react';
import { ShoppingBag, Download, Eye, Clock } from 'lucide-react';

export function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/designs')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.data);
                }
            })
            .catch(err => console.error("Could not fetch orders", err))
            .finally(() => setLoading(false));
    }, []);

    const downloadImage = (url: string, name: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = name || "design.png";
        a.click();
    };

    return (
        <div className="p-8 h-full bg-slate-50 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-indigo-600" /> Customer Orders
            </h2>
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 grid grid-cols-12 gap-4 text-sm font-semibold text-slate-600">
                    <div className="col-span-3">Design ID</div>
                    <div className="col-span-3">Product Name</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-right">Created</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="flex-1 overflow-auto p-2">
                    {loading ? (
                        <div className="p-10 text-center text-slate-400">Loading Orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">No orders placed yet.</div>
                    ) : (
                        <div className="space-y-2">
                            {orders.map(order => {
                                // Extract preview URL safely assuming deep population
                                const previewUrl = order.latestVersionId?.previewAssetIds?.[0]?.publicUrl;
                                const date = new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={order._id} className="p-4 grid grid-cols-12 gap-4 items-center bg-white border border-slate-100 rounded-lg hover:border-indigo-200 hover:shadow-sm transition-all group">
                                        <div className="col-span-3 flex items-center gap-3">
                                            {previewUrl ? (
                                                <img src={previewUrl} className="w-12 h-12 rounded bg-indigo-50 border border-slate-200 object-contain" alt="" />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                    <Eye className="w-4 h-4 text-slate-300" />
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[120px] block" title={order._id}>
                                                    {order._id.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-sm font-medium text-slate-800 truncate">{order.productId?.title || 'Unknown Product'}</p>
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold capitalize whitespace-nowrap">
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                                                <Clock className="w-3 h-3" /> {date}
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <button
                                                disabled={!previewUrl}
                                                onClick={() => previewUrl && downloadImage(previewUrl, `Design_${order._id}.png`)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${previewUrl ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white' : 'bg-slate-50 text-slate-400 cursor-not-allowed'}`}
                                            >
                                                <Download className="w-4 h-4" /> Print File
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
