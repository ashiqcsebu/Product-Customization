import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, ShoppingBag } from 'lucide-react';

// Placeholders for actual pages
const Dashboard = () => <div className="p-8"><h1>Dashboard</h1><p>Welcome to the customizer admin.</p></div>;
const Products = () => <div className="p-8"><h1>Products Configuration</h1><p>Select a product to configure print areas.</p></div>;
const Orders = () => <div className="p-8"><h1>Orders</h1><p>Download customer print files here.</p></div>;

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800">Shabu Admin</h1>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/products" className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md font-medium">
            <Package className="w-5 h-5" /> Products
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md font-medium">
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md font-medium">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
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
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
