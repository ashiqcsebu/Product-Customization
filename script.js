const fs = require('fs');
let code = fs.readFileSync('apps/web/src/app/customize/[productId]/page.tsx', 'utf8');

// 1. Add imports
code = code.replace(
    'import { useQuery } from "@tanstack/react-query";',
    'import { useState } from "react";\nimport { useQuery } from "@tanstack/react-query";'
);

// 2. Add pricing hook
const hookTarget = '    if (loadingProduct || loadingConfig) {';
const hookReplacement = `    const [qty, setQty] = useState(1);

    const { data: pricingData } = useQuery({
        queryKey: ["pricing", productId, qty, config],
        queryFn: async () => {
            const res = await fetch(\`\${getApiUrl()}/pricing/calculate\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    variables: {
                        width: 6,
                        height: 4,
                        area: 24,
                        quantity: qty
                    }
                })
            });
            if (!res.ok) throw new Error("Failed to calculate price");
            return res.json();
        },
        enabled: !!config
    });

    const finalPrice = pricingData?.success 
        ? pricingData.data.finalPrice 
        : (product?.variants?.[0]?.price || 0);

    if (loadingProduct || loadingConfig) {`;
code = code.replace(hookTarget, hookReplacement);

// 3. Add price to Title
const titleTarget = `                        <h1 className="font-semibold text-[15px] leading-tight text-slate-900">
                            {product?.title || "Business Card"}
                        </h1>`;
const titleReplacement = `                        <h1 className="font-semibold text-[15px] leading-tight text-slate-900 flex items-center gap-2">
                            {product?.title || "Business Card"}
                            <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded font-bold">
                                $\\{finalPrice ? Number(finalPrice).toFixed(2) : "0.00"}
                            </span>
                        </h1>`;
code = code.replace(titleTarget, titleReplacement);

// 4. Update Save API to pass quantity and price
const saveTarget = `                                        canvasData,
                                        previewImage: dataUrl
                                    })
                                });`;
const saveReplacement = `                                        canvasData,
                                        previewImage: dataUrl,
                                        quantity: qty,
                                        finalCalculatedPrice: finalPrice
                                    })
                                });`;
code = code.replace(saveTarget, saveReplacement);

// 5. Update Add to Cart buttons
const btnTarget = `                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="h-[38px] text-slate-600 hover:text-slate-900 font-medium">
                        <Undo2 className="w-4 h-4 mr-2" /> Undo`;
const btnReplacement = `                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-[38px] mr-2">
                        <button className="px-3 text-slate-500 hover:text-slate-800" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                        <span className="text-sm font-semibold text-slate-800 min-w-8 text-center">\\{qty}</span>
                        <button className="px-3 text-slate-500 hover:text-slate-800" onClick={() => setQty(qty + 1)}>+</button>
                    </div>
                    
                    <Button variant="ghost" className="h-[38px] text-slate-600 hover:text-slate-900 font-medium">
                        <Undo2 className="w-4 h-4 mr-2" /> Undo`;
code = code.replace(btnTarget, btnReplacement);

fs.writeFileSync('apps/web/src/app/customize/[productId]/page.tsx', code, 'utf8');
console.log('Update Complete.');
