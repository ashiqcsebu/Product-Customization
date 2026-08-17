import React, { useState } from 'react';
import { Palette, Type, Image as ImageIcon, Settings2, Save, Globe, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Theme');

    const [themeConfig, setThemeConfig] = useState({
        primaryColor: '#6C5CE7',
        secondaryColor: '#00CEC9',
        bgColor: '#FFFFFF',
        textColor: '#2D3436',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="flex-1 overflow-auto bg-[#F8FAFC] text-slate-800 font-sans p-8 max-w-[1200px] mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Settings</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage global theme configurations, typography, and branding.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#6C5CE7] text-white font-bold px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-600 transition"
                >
                    {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaved ? 'Saved!' : 'Save Settings'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1">
                    {[
                        { id: 'Theme', label: 'Theme Colors', icon: <Palette className="w-4 h-4" /> },
                        { id: 'Typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
                        { id: 'Branding', label: 'Branding & Logo', icon: <ImageIcon className="w-4 h-4" /> },
                        { id: 'Localization', label: 'Localization', icon: <Globe className="w-4 h-4" /> },
                        { id: 'Advanced', label: 'Advanced Settings', icon: <Settings2 className="w-4 h-4" /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-white shadow-sm text-indigo-700 border border-slate-200'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent'
                                }`}
                        >
                            <span className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    {activeTab === 'Theme' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2">Global Colors</h2>
                                <p className="text-sm text-slate-500 mb-6">Choose the color palette that perfectly matches your brand identity.</p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Primary Color</label>
                                        <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-2 focus-within:border-indigo-500 transition">
                                            <input
                                                type="color"
                                                value={themeConfig.primaryColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={themeConfig.primaryColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                                                className="font-mono text-sm text-slate-700 outline-none w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Secondary Color</label>
                                        <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-2 focus-within:border-indigo-500 transition">
                                            <input
                                                type="color"
                                                value={themeConfig.secondaryColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, secondaryColor: e.target.value })}
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={themeConfig.secondaryColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, secondaryColor: e.target.value })}
                                                className="font-mono text-sm text-slate-700 outline-none w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Background Color</label>
                                        <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-2 focus-within:border-indigo-500 transition">
                                            <input
                                                type="color"
                                                value={themeConfig.bgColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, bgColor: e.target.value })}
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={themeConfig.bgColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, bgColor: e.target.value })}
                                                className="font-mono text-sm text-slate-700 outline-none w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Text Color</label>
                                        <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-2 focus-within:border-indigo-500 transition">
                                            <input
                                                type="color"
                                                value={themeConfig.textColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, textColor: e.target.value })}
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={themeConfig.textColor}
                                                onChange={e => setThemeConfig({ ...themeConfig, textColor: e.target.value })}
                                                className="font-mono text-sm text-slate-700 outline-none w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2">Border Radius</h2>
                                <p className="text-sm text-slate-500 mb-6">Select the corner harshness for all UI elements in your storefront.</p>

                                <div className="flex gap-4">
                                    {['0px', '4px', '8px', '16px', '9999px'].map(radius => (
                                        <button
                                            key={radius}
                                            onClick={() => setThemeConfig({ ...themeConfig, borderRadius: radius })}
                                            className={`flex-1 py-3 border text-sm font-bold transition-all ${themeConfig.borderRadius === radius
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            style={{ borderRadius: radius }}
                                        >
                                            {radius === '9999px' ? 'Pill' : radius === '0px' ? 'Sharp' : radius}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Typography' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2">Font Hierarchy</h2>
                                <p className="text-sm text-slate-500 mb-6">Select default fonts for headings and body text to match your brand language.</p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Base Font Family</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            value={themeConfig.fontFamily}
                                            onChange={(e) => setThemeConfig({ ...themeConfig, fontFamily: e.target.value })}
                                        >
                                            <option value="Inter, sans-serif">Inter (Sans Serif)</option>
                                            <option value="Roboto, sans-serif">Roboto (Sans Serif)</option>
                                            <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                                            <option value="'Courier New', monospace">Courier New (Monospace)</option>
                                        </select>
                                    </div>

                                    <div className="p-6 border border-slate-200 shadow-sm rounded-xl" style={{ fontFamily: themeConfig.fontFamily }}>
                                        <h3 className="text-2xl font-bold mb-3" style={{ color: themeConfig.textColor }}>Typography Preview</h3>
                                        <p className="text-sm leading-relaxed opacity-80" style={{ color: themeConfig.textColor }}>
                                            The quick brown fox jumps over the lazy dog. Typography plays a critical role in establishing brand identity and creating a readable, enjoyable user experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Example Placeholders for other tabs */}
                    {activeTab === 'Branding' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-2">Store Logo</h2>
                                <p className="text-sm text-slate-500 mb-6">Upload your store logo to be displayed inside the customization widget.</p>

                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition border-indigo-200 hover:border-indigo-400">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-800">Click to upload logo</span>
                                    <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Localization' && (
                        <div className="flex items-center justify-center h-48 text-slate-500">
                            Localization settings coming soon...
                        </div>
                    )}

                    {activeTab === 'Advanced' && (
                        <div className="flex items-center justify-center h-48 text-slate-500">
                            Advanced CSS injection coming soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
