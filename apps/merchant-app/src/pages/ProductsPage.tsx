import { useEffect, useState } from 'react';
import { Package, Image as ImageIcon, Save, ScanLine, Edit2 } from 'lucide-react';

export function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Fetch products
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data.products || data.data);
                }
            })
            .catch(err => console.error("Could not fetch products", err));
    }, []);

    return (
        <div className="flex h-full">
            {/* Sidebar for Product List */}
            <div className="w-1/3 max-w-sm border-r border-slate-200 bg-white p-6 overflow-y-auto">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" /> Products
                </h2>
                <div className="space-y-3">
                    {products.length === 0 ? (
                        <p className="text-sm text-slate-500">No products found. Start seed script or check DB.</p>
                    ) : null}
                    {products.map((p) => (
                        <button
                            key={p.id || p._id}
                            onClick={() => setSelectedProductId(p.id || p._id)}
                            className={`w-full text-left p-4 rounded-xl transition-all border ${selectedProductId === (p.id || p._id) ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                                    {p.featuredImage ? (
                                        <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm truncate">{p.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{p.status || 'Active'}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Configuration Area */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden">
                {selectedProductId ? (
                    <ProductConfigurator productId={selectedProductId} />
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-3">
                        <ScanLine className="w-12 h-12 mb-2 opacity-50" />
                        <p>Select a product to configure mapping</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductConfigurator({ productId }: { productId: string }) {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/api/v1/config/${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setConfig(data.data);
                } else {
                    // Not configured yet, set defaults
                    setConfig({
                        canvasWidth: 800,
                        canvasHeight: 800,
                        views: [{
                            key: 'front',
                            name: 'Front',
                            overlayImage: '',
                            printArea: { x: 200, y: 200, width: 400, height: 400 },
                            bleedArea: { x: 190, y: 190, width: 420, height: 420 }
                        }]
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [productId]);

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/config/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const data = await res.json();
            if (data.success) {
                alert('Configuration Saved!');
            }
        } catch (err) {
            alert('Failed to save config.');
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading Configuration...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Customizer Setup</h2>
                    <p className="text-sm text-slate-500 mt-1">Configure print areas and boundaries for ID: {productId}</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Save className="w-4 h-4" /> Save Configuration
                </button>
            </div>

            <div className="flex-1 overflow-auto p-8 flex gap-8">
                {/* Fake visual editor mapping for now */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 text-sm flex items-center gap-2"><Edit2 className="w-4 h-4" /> Canvas Preview (Front)</span>
                    </div>
                    <div className="flex-1 bg-slate-100 relative min-h-[500px]" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        {/* T-Shirt background mockup */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                            <ImageIcon className="w-64 h-64 text-slate-400" />
                        </div>

                        {/* Draggable Print Area Mockup */}
                        {config?.views?.[0] && (
                            <div
                                className="absolute border-2 border-dashed border-indigo-600 bg-indigo-600/10 flex items-center justify-center cursor-move shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                                style={{
                                    left: '25%', top: '25%', width: '50%', height: '50%'
                                }}
                            >
                                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded font-mono shadow-sm">Print Area (400x400)</span>

                                {/* Resize handles */}
                                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nwse-resize"></div>
                                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nesw-resize"></div>
                                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nesw-resize"></div>
                                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nwse-resize"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Config Details */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Canvas Metrics</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Canvas Width</label>
                                <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={config?.canvasWidth || ''} onChange={(e) => setConfig({ ...config, canvasWidth: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Canvas Height</label>
                                <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={config?.canvasHeight || ''} onChange={(e) => setConfig({ ...config, canvasHeight: parseInt(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Print Boundary</h3>
                        {config?.views?.[0]?.printArea && (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 text-xs block">X Pos</span>
                                    <span className="font-mono text-slate-700 font-semibold">{config.views[0].printArea.x}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 text-xs block">Y Pos</span>
                                    <span className="font-mono text-slate-700 font-semibold">{config.views[0].printArea.y}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 text-xs block">Width</span>
                                    <span className="font-mono text-slate-700 font-semibold">{config.views[0].printArea.width}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 text-xs block">Height</span>
                                    <span className="font-mono text-slate-700 font-semibold">{config.views[0].printArea.height}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
