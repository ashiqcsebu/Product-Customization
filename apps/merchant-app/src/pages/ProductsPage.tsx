import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Plus, Download, Upload, Filter, Columns, ChevronDown, RefreshCw,
    MoreVertical, Edit2, Box, CheckCircle2, FileText, Lock, SlidersHorizontal
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    // Pagination and Filters State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterVendor, setFilterVendor] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
    const [stats, setStats] = useState({ all: 0, active: 0, draft: 0, archived: 0 });

    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [pricingConfig, setPricingConfig] = useState({ action: 'decrease_%', value: 20 });
    const [isSyncing, setIsSyncing] = useState(false);

    // Fetch products dynamically whenever params change
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            status: filterStatus || activeTab,
            ...(searchQuery ? { search: searchQuery } : {}),
            ...(filterType ? { type: filterType } : {}),
            ...(filterVendor ? { vendor: filterVendor } : {})
        });

        fetch(`${API_URL}/products?${params.toString()}`)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setProducts(resData.data.products || []);
                    setPagination(resData.data.pagination);
                    setStats(resData.data.stats);
                } else if (Array.isArray(resData)) {
                    setProducts(resData);
                }
            })
            .catch(err => console.error("Could not fetch products", err))
            .finally(() => setLoading(false));
    }, [page, limit, activeTab, searchQuery, filterType, filterVendor, filterStatus]);

    const handleBulkPricing = async () => {
        if (!confirm(`Apply pricing rules to ${selectedProducts.length} products?`)) return;

        try {
            const res = await fetch(`${API_URL}/products/bulk/pricing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productIds: selectedProducts,
                    action: pricingConfig.action,
                    value: pricingConfig.value
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`${data.variantsUpdated} variants updated successfully!`);
                setIsPricingModalOpen(false);
                setSelectedProducts([]);
                setPage(1); // refresh trigger
            } else {
                alert(`Error: ${data.message || 'Failed to update pricing'}`);
            }
        } catch (error) {
            alert('Network error while updating pricing');
        }
    };

    const tabs = ['All', 'Active', 'Inactive', 'Draft', 'Archived'];

    const handleSync = async () => {
        if (!confirm('This will fetch all latest products from your Shopify store. It might take a moment. Proceed?')) return;
        setIsSyncing(true);
        try {
            const res = await fetch(`${API_URL}/products/sync`, { method: 'POST' });
            const data = await res.json();
            if (data.success || data.message) {
                alert(`Sync successful! Extracted products.`);
                setPage(1); // Force a re-fetch of the product list
            } else {
                alert('Sync failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert('Failed to reach sync endpoint.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="h-full bg-[#f8fafc] flex flex-col p-8 overflow-y-auto w-full custom-scrollbar">

            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-black text-slate-900 tracking-tight">All Products</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage and organize all your products from one place.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
                        {isSyncing ? <RefreshCw className="w-4 h-4 text-slate-500 animate-spin" /> : <Upload className="w-4 h-4 text-slate-500" />} Sync Shopify
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-semibold shadow-sm hover:bg-slate-50 transition">
                        <Download className="w-4 h-4 text-slate-500" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-md text-sm font-semibold shadow-sm transition">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="All Products"
                    value={stats.all}
                    icon={<Box className="w-6 h-6 text-indigo-600" />}
                    bgClass="bg-indigo-50"
                />
                <StatCard
                    title="Active"
                    value={stats.active}
                    icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                    bgClass="bg-emerald-50"
                />
                <StatCard
                    title="Draft"
                    value={stats.draft}
                    icon={<FileText className="w-6 h-6 text-amber-600" />}
                    bgClass="bg-amber-50"
                />
                <StatCard
                    title="Archived"
                    value={stats.archived}
                    icon={<Lock className="w-6 h-6 text-slate-600" />}
                    bgClass="bg-slate-100"
                />
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">

                {/* View Toolbar */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                    <div className="flex gap-6">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-bold transition-colors relative pb-4 -mb-4 ${activeTab === tab
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <Columns className="w-4 h-4" /> Columns
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <StarIcon className="w-4 h-4 text-amber-400" /> Saved Views <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="px-6 py-4 flex gap-4 bg-[#F8FAFC] border-b border-slate-200">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:font-normal shadow-sm"
                        />
                    </div>

                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 outline-none shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_0.5rem_center] bg-no-repeat pr-10">
                        <option value="">Product type</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                    </select>

                    <select value={filterVendor} onChange={(e) => setFilterVendor(e.target.value)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 outline-none shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_0.5rem_center] bg-no-repeat pr-10">
                        <option value="">Vendor</option>
                        <option value="Craftify Apparel">Craftify Apparel</option>
                    </select>

                    <select className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 outline-none shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_0.5rem_center] bg-no-repeat pr-10">
                        <option value="">Tags</option>
                        <option value="CUSTOMIZABLE">Customizable</option>
                    </select>

                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 outline-none shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_0.5rem_center] bg-no-repeat pr-10">
                        <option value="">Status</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                    </select>

                    <button className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 ml-auto shadow-sm">
                        More Filters <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-slate-200">
                            <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={products.length > 0 && selectedProducts.length === products.length}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedProducts(products.map(p => p.id || p._id));
                                            else setSelectedProducts([]);
                                        }}
                                        className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Vendor</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Tags</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id || product._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-center align-middle">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id || product._id)}
                                                onChange={(e) => {
                                                    const pid = product.id || product._id;
                                                    if (e.target.checked) setSelectedProducts([...selectedProducts, pid]);
                                                    else setSelectedProducts(selectedProducts.filter(id => id !== pid));
                                                }}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                                                    ) : product.featuredImage ? (
                                                        <img src={product.featuredImage.url || product.featuredImage} alt={product.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Box className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0">
                                                    <span className="font-bold text-slate-900 block leading-tight">{product.title}</span>
                                                    <span className="text-[11px] font-medium text-slate-500">{product.variants?.length || 0} variants</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle">
                                            <StatusBadge status={product.status || 'Active'} />
                                        </td>
                                        <td className="px-4 py-4 align-middle text-sm text-slate-600 font-medium">
                                            {product.productType || 'Apparel'}
                                        </td>
                                        <td className="px-4 py-4 align-middle text-sm text-slate-600 font-medium">
                                            {product.vendor || 'StoreMaster'}
                                        </td>
                                        <td className="px-4 py-4 align-middle text-sm text-slate-900 font-bold">
                                            ${product.price?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-4 py-4 align-middle">
                                            <div className="flex gap-2 flex-wrap">
                                                {product.tags && product.tags.length > 0 ? (
                                                    product.tags.slice(0, 2).map((tag: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wide border border-indigo-100">{tag}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle text-right min-w-[200px]">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => window.location.href = `/options?product=${product.id || product._id}`} className="px-4 py-1.5 text-xs font-bold bg-[#EEF2FF] text-[#4F46E5] rounded-md hover:bg-indigo-100 transition-colors mr-2">
                                                    Customize
                                                </button>
                                                <div className="flex items-center text-slate-400 gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                                    <Link to={`/products/${product._id}`} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition" title="Edit">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button className="p-1.5 hover:bg-slate-100 rounded hover:text-indigo-600 transition">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-600 font-medium font-sans">
                    <div>Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products</div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button className="px-3 py-1.5 border border-slate-200 bg-indigo-50 text-indigo-700 font-bold rounded-lg pointer-events-none">
                            {pagination.page}
                        </button>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>

            {/* Sticky Bulk Action Toolbar */}
            {selectedProducts.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex items-center gap-6 z-50 animate-in slide-in-from-bottom-8">
                    <div className="font-bold text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                        {selectedProducts.length} Products Selected
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <div className="flex items-center gap-1">
                        <button className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition">Bulk Edit</button>
                        <button onClick={() => setIsPricingModalOpen(true)} className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition text-emerald-400">Pricing</button>
                        <button className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition">Tags</button>
                        <button className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition">Collections</button>
                        <button className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition">Inventory</button>
                        <button className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition">Status</button>
                        <button className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold transition flex items-center gap-1 ml-2 border-l border-slate-700 pl-4 rounded-none rounded-r-lg">
                            More <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Pricing Modal */}
            {isPricingModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">Bulk Price Update</h2>
                            <p className="text-sm text-slate-500 mt-1">Applying to {selectedProducts.length} selected products</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Action</label>
                                <select
                                    value={pricingConfig.action}
                                    onChange={(e) => setPricingConfig({ ...pricingConfig, action: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                                >
                                    <option value="decrease_%">Decrease by Percentage</option>
                                    <option value="increase_%">Increase by Percentage</option>
                                    <option value="decrease_fixed">Decrease Fixed Amount</option>
                                    <option value="increase_fixed">Increase Fixed Amount</option>
                                    <option value="set_fixed">Set Fixed Price</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Value</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={pricingConfig.value}
                                        onChange={(e) => setPricingConfig({ ...pricingConfig, value: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 pl-8 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                        {pricingConfig.action.includes('%') ? '%' : '$'}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg font-medium border border-emerald-100 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>Preview: E.g., A $100 product will become {
                                    pricingConfig.action === 'decrease_%' ? `$${(100 - (100 * pricingConfig.value / 100)).toFixed(2)}` :
                                        pricingConfig.action === 'increase_%' ? `$${(100 + (100 * pricingConfig.value / 100)).toFixed(2)}` :
                                            pricingConfig.action === 'decrease_fixed' ? `$${(100 - pricingConfig.value).toFixed(2)}` :
                                                pricingConfig.action === 'increase_fixed' ? `$${(100 + pricingConfig.value).toFixed(2)}` :
                                                    `$${pricingConfig.value.toFixed(2)}`
                                }.</span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                            <button
                                onClick={() => setIsPricingModalOpen(false)}
                                className="px-4 py-2 font-bold text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkPricing}
                                className="px-5 py-2 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

// Helpers

function StatCard({ title, value, icon, bgClass }: { title: string, value: number, icon: any, bgClass: string }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group hover:border-indigo-100 min-h-[110px]">
            <div className="flex items-center justify-between w-full">
                <h3 className="text-[15px] font-bold text-[#4B5563]">{title}</h3>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto -rotate-90 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgClass} group-hover:scale-105 transition-transform`}>
                    {icon}
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{value.toString()}</div>
            </div>
        </div>
    );
}

function StarIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
    );
}

function FilterDropdown({ label }: { label: string }) {
    return (
        <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            {label} <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === 'active' || s === 'published') {
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Active</span>;
    }
    if (s === 'draft') {
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">Draft</span>;
    }
    if (s === 'archived') {
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-300">Archived</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-300">{status}</span>;
}
