import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, ShoppingBag, Calculator } from 'lucide-react';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { PricingRulesPage } from './pages/PricingRulesPage';
import { PricingRuleBuilder } from './pages/PricingRuleBuilder';

// Placeholders for actual pages
const Dashboard = () => <div className="p-8"><h1>Dashboard</h1><p>Welcome to the customizer admin.</p></div>;

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path) && (path !== '/' || location.pathname === '/');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white leading-tight">Craftify</h1>
            <span className="text-[11px] text-indigo-300">Pricing Engine</span>
          </div>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive('/') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/pricing" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive('/pricing') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Calculator className="w-4 h-4" /> Pricing Rules
          </Link>
          <Link to="/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive('/products') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Package className="w-4 h-4" /> Products
          </Link>
          <Link to="/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive('/orders') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <ShoppingBag className="w-4 h-4" /> Orders
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive('/settings') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50">
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
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/pricing" element={<PricingRulesPage />} />
          <Route path="/pricing/new" element={<PricingRuleBuilder />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
