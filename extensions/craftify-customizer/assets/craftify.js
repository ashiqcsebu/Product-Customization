document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".craftify-container");

    containers.forEach(container => {
        const productId = container.getAttribute("data-product-id");
        const basePriceStr = container.getAttribute("data-base-price") || "0";
        const basePrice = parseFloat(basePriceStr.replace(/,/g, ''));
        const config = window.CraftifyConfig ? window.CraftifyConfig[productId] : null;

        if (!config || !config.options || config.options.length === 0) {
            // No customizer config, just hide
            container.style.display = 'none';
            return;
        }

        const currency = window.ShopifyCurrency || "$";
        let state = {};

        // Initialize state
        config.options.forEach(opt => {
            if (opt.choices && opt.choices.length > 0) {
                state[opt.id] = opt.choices[0].id;
            }
        });

        const render = () => {
            let html = ``;
            let additionalCost = 0;

            // Render Options
            config.options.forEach(opt => {
                html += `<div class="craftify-option-group">`;
                html += `<div class="craftify-option-label">${opt.label || opt.name}</div>`;

                // Assuming we default to swatch-style mapping or dropdown based on config.
                // We'll use swatches for everything as a beautiful default
                html += `<div class="craftify-swatches">`;
                const choices = opt.choices || [];
                choices.forEach(val => {
                    const isChecked = state[opt.id] === val.id;
                    const priceMod = val.priceModifier || 0;
                    if (isChecked) {
                        additionalCost += parseFloat(priceMod);
                    }

                    html += `
                        <label class="craftify-swatch-item">
                            <input type="radio" name="craftify_${opt.id}" value="${val.id}" ${isChecked ? 'checked' : ''} onchange="window.CraftifyUpdate('${productId}', '${opt.id}', '${val.id}')">
                            <div class="craftify-swatch-box">
                                ${val.label}
                                ${priceMod > 0 ? `<span class="craftify-option-price">(+${currency}${priceMod})</span>` : ''}
                            </div>
                        </label>
                    `;
                });
                html += `</div></div>`;
            });

            const finalPrice = basePrice + additionalCost;

            html += `
                <div class="craftify-price-summary">
                    <div class="craftify-price-row">
                        <span>Base Price</span>
                        <span>${currency}${basePrice.toFixed(2)}</span>
                    </div>
                    ${additionalCost > 0 ? `
                    <div class="craftify-price-row">
                        <span>Customizations</span>
                        <span>+${currency}${additionalCost.toFixed(2)}</span>
                    </div>` : ''}
                    <div class="craftify-price-total">
                        <span>Total Price</span>
                        <span>${currency}${finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            `;

            container.innerHTML = html;
        };

        // Global update handler
        window.CraftifyUpdate = (pId, optId, valId) => {
            if (pId === productId) {
                state[optId] = valId;
                render();
            }
        };

        render();
    });
});
