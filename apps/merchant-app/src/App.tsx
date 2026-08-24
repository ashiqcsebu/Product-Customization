import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, Settings, ShoppingBag, Calculator,
    Box, FileType, Activity, AlertCircle, ChevronDown, Sliders, RefreshCw, ArrowUpToLine
} from 'lucide-react';

import { ProductsPage } from './pages/ProductsPage';
import { ProductEditPage } from './pages/ProductEditPage';
import { OrdersPage } from './pages/OrdersPage';
import { PricingTemplatesPage } from './pages/PricingRulesPage';
import { PricingRuleBuilder } from './pages/PricingRuleBuilder';
import { ProductOptionsBuilder } from './pages/ProductOptionsBuilder';
import { Dashboard } from './pages/Dashboard';
import { TemplatesPage } from './pages/TemplatesPage';
import { ImportExportPage } from './pages/ImportExportPage';
import { ActivityPage } from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';

function AppLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const NavLink = ({ to, icon, label, badge }: any) => {
        const active = isActive(to);
        return (
            <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 mb-1 ${active ? 'bg-[#6C5CE7] text-white shadow-[0_0_15px_rgba(108,92,231,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{label}</span>
                </div>
                {badge && <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">{badge}</span>}
            </Link>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans">

            {/* Sidebar matching mockup */}
            <aside className="w-[260px] bg-[#1a1b26] border-r border-[#26283C] flex flex-col text-slate-300 relative z-20">

                {/* Logo Area */}
                <div className="p-6 pt-8 mb-4 border-b border-[#26283C]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-[#6C5CE7] flex items-center justify-center text-white shadow-lg">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[15px] font-black text-white leading-tight">Custom Variant</h1>
                            <span className="text-[12px] font-bold text-indigo-300">Personalizer</span>
                        </div>
                    </div>
                </div>

                {/* Links */}
                <nav className="px-4 flex-1 overflow-y-auto custom-scrollbar">
                    <NavLink to="/" icon={<LayoutDashboard className="w-[18px] h-[18px]" />} label="Dashboard" />

                    {/* Expandable Products Menu */}
                    <div className="mb-1">
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent accidental navigation if there's any wrapper
                                const el = document.getElementById('products-submenu');
                                if (el) {
                                    el.classList.toggle('hidden');
                                }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${(location.pathname.startsWith('/products') || location.pathname.startsWith('/options') || location.pathname.startsWith('/templates') || location.pathname.startsWith('/pricing') || location.pathname.startsWith('/conditional-rules')) ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Package className="w-[18px] h-[18px]" />
                                <span>Products</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>

                        <div id="products-submenu" className={`mt-1 mb-2 ${!(location.pathname.startsWith('/products') || location.pathname.startsWith('/options') || location.pathname.startsWith('/templates') || location.pathname.startsWith('/pricing') || location.pathname.startsWith('/conditional-rules')) ? 'hidden' : ''}`}>
                            <div className="pl-[2.75rem] pr-2 space-y-1 py-1">
                                <Link to="/products" className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/products') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                                    All Products
                                </Link>
                                <Link to="/options" className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/options') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                                    Options
                                </Link>
                                <Link to="/templates" className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/templates') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                                    Templates
                                </Link>
                                <Link to="/pricing" className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/pricing') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                                    Pricing
                                </Link>
                                <Link to="/conditional-rules" className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/conditional-rules') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                                    Conditional Rules
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="my-6 border-t border-[#26283C]/70"></div>

                    <NavLink to="/sync" icon={<RefreshCw className="w-[18px] h-[18px]" />} label="Shopify Sync" />
                    <NavLink to="/import-export" icon={<ArrowUpToLine className="w-[18px] h-[18px]" />} label="Import / Export" />
                    <NavLink to="/activity" icon={<Activity className="w-[18px] h-[18px]" />} label="Activity" />
                    <NavLink to="/issues" icon={<AlertCircle className="w-[18px] h-[18px]" />} label="Issues" badge="12" />

                    <div className="my-6 border-t border-[#26283C]/70"></div>

                    <NavLink to="/settings" icon={<Settings className="w-[18px] h-[18px]" />} label="Settings" />
                </nav>

                {/* Footer profile block */}
                <div className="p-4 border-t border-[#26283C]">
                    <div className="bg-[#26283C]/50 rounded-xl p-3 mb-2 flex items-center justify-between cursor-pointer hover:bg-[#26283C] transition">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">My Print Store</span>
                                <span className="text-[10px] text-slate-400">myprintstore.myshopify.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition">
                        <div className="flex items-center gap-3">
                            <img src="https://ui-avatars.com/api/?name=John+Smith&background=6C5CE7&color=fff" className="w-8 h-8 rounded-full" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-tight">John Smith</span>
                                <span className="text-[10px] text-slate-400">john@myprintstore.com</span>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>

            </aside>

            <main className="flex-1 overflow-auto bg-[#F8FAFC]">
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductEditPage />} />
                    <Route path="/options" element={<ProductOptionsBuilder />} />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/pricing" element={<PricingTemplatesPage />} />
                    <Route path="/conditional-rules" element={<PricingTemplatesPage />} />
                    <Route path="/pricing/new" element={<PricingRuleBuilder />} />
                    <Route path="/pricing/:id" element={<PricingRuleBuilder />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/sync" element={<ProductsPage />} />
                    <Route path="/import-export" element={<ImportExportPage />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="/issues" element={<ActivityPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </AppLayout>
        </BrowserRouter>
    );
}

export default App;
