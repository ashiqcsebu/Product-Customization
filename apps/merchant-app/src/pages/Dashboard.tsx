import { Bell, RefreshCw, ShoppingBag, Sliders, Box, Grid, List, CheckCircle2, FileText, AlertTriangle, Search, Plus, MoreVertical } from "lucide-react";

export function Dashboard() {
    return (
        <div className="flex-1 overflow-auto bg-[#F8FAFC] text-slate-800 font-sans p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Overview of your store and product configurations</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition">
                        <RefreshCw className="w-4 h-4" /> Sync Shopify
                    </button>
                    <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid (4x2) */}
            <div className="grid grid-cols-4 gap-4 mb-10">
                <StatCard icon={<ShoppingBag className="w-6 h-6 text-indigo-500" />} title="Total Products" value="378" subtitle="View all products" bg="bg-indigo-50" />
                <StatCard icon={<Sliders className="w-6 h-6 text-emerald-500" />} title="With Custom Options" value="156" subtitle="41.27% of products" bg="bg-emerald-50" />
                <StatCard icon={<Box className="w-6 h-6 text-blue-500" />} title="With Variants" value="132" subtitle="34.92% of products" bg="bg-blue-50" />
                <StatCard icon={<Grid className="w-6 h-6 text-orange-500" />} title="Total Options" value="28" subtitle="Across all products" bg="bg-orange-50" />
                <StatCard icon={<List className="w-6 h-6 text-purple-500" />} title="Total Variants" value="2,456" subtitle="Variant combinations" bg="bg-purple-50" />
                <StatCard icon={<CheckCircle2 className="w-6 h-6 text-green-500" />} title="Active Products" value="352" subtitle="Active in store" bg="bg-green-50" />
                <StatCard icon={<FileText className="w-6 h-6 text-amber-500" />} title="Draft Products" value="18" subtitle="In draft status" bg="bg-amber-50" />
                <StatCard icon={<AlertTriangle className="w-6 h-6 text-red-500" />} title="Out of Stock" value="27" subtitle="Products out of stock" bg="bg-red-50" />
            </div>

            {/* Recently Updated Products */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Recently Updated Products</h2>
                    <button className="text-sm font-bold text-[#6C5CE7] hover:text-indigo-700">View all &gt;</button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    <ProductCard title="Custom Banner" updated="Updated 2h ago" image="https://images.unsplash.com/photo-1542382156909-9ae37b3f5b99?auto=format&fit=crop&w=300&q=80" />
                    <ProductCard title="Polo Shirt" updated="Updated 5h ago" image="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=300&q=80" />
                    <ProductCard title="Business Card" updated="Updated 1d ago" image="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=300&q=80" />
                    <ProductCard title="Hoodie" updated="Updated 1d ago" image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=300&q=80" />
                    <ProductCard title="Mug" updated="Updated 2d ago" image="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=300&q=80" />
                </div>
            </div>

            {/* All Products Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">All Products</h2>
                        <p className="text-sm text-slate-500">Manage and configure your store products</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#6C5CE7] hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm transition">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#6C5CE7]" />
                    </div>
                    <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#6C5CE7]">
                        <option>All Status</option>
                    </select>
                    <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#6C5CE7]">
                        <option>All Products</option>
                    </select>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">More Filters v</button>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                            <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Variants</th>
                            <th className="p-4 text-center">Options</th>
                            <th className="p-4 text-center">Pricing</th>
                            <th className="p-4">Last Updated</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableRow id="#1001" name="Custom Banner" status="Active" variants={12} options={4} pricing="Configured" date="Today, 10:30 AM" img="https://images.unsplash.com/photo-1542382156909-9ae37b3f5b99?auto=format&fit=crop&w=40&h=40&q=80" />
                        <TableRow id="#1002" name="Polo Shirt" status="Active" variants={8} options={3} pricing="Configured" date="Yesterday, 4:20 PM" img="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=40&h=40&q=80" />
                        <TableRow id="#1003" name="Business Card" status="Draft" variants={0} options={6} pricing="Not Set" date="Aug 14, 2025" img="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=40&h=40&q=80" />
                        <TableRow id="#1004" name="Hoodie" status="Active" variants={6} options={4} pricing="Configured" date="Aug 13, 2025" img="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=40&h=40&q=80" />
                        <TableRow id="#1005" name="Mug" status="Active" variants={4} options={2} pricing="Configured" date="Aug 12, 2025" img="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=40&h=40&q=80" />
                    </tbody>
                </table>
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1 to 5 of 378 products</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">&lt;</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#6C5CE7] text-white font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">3</button>
                        <span className="w-8 h-8 flex items-center justify-center">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">76</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100">&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, subtitle, bg }: any) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-[13px] font-bold text-slate-500 mb-0.5">{title}</h3>
                    <span className="text-2xl font-black text-slate-800 tracking-tight leading-none block mb-1">{value}</span>
                    <span className="text-xs text-slate-400">{subtitle}</span>
                </div>
            </div>
        </div>
    );
}

function ProductCard({ title, updated, image }: any) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer group">
            <div className="h-32 bg-slate-100 relative overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-3">
                <h4 className="text-sm font-bold text-slate-800 truncate">{title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{updated}</p>
            </div>
        </div>
    );
}

function TableRow({ id, name, status, variants, options, pricing, date, img }: any) {
    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition">
            <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
            <td className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <img src={img} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">{name}</h4>
                    <span className="text-xs text-slate-500">{id}</span>
                </div>
            </td>
            <td className="p-4">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {status}
                </span>
            </td>
            <td className="p-4 text-center font-medium">{variants}</td>
            <td className="p-4 text-center font-medium">{options}</td>
            <td className="p-4 text-center">
                <span className={`text-xs font-bold ${pricing === "Configured" ? "text-emerald-500" : "text-rose-500"}`}>{pricing}</span>
            </td>
            <td className="p-4 text-xs text-slate-500">{date}</td>
            <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition">Manage</button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition"><MoreVertical className="w-4 h-4" /></button>
                </div>
            </td>
        </tr>
    );
}
