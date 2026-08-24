document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".craftify-container");

    containers.forEach(container => {
        const productId = container.getAttribute("data-product-id");
        const basePriceStr = container.getAttribute("data-base-price") || "0";
        const basePrice = parseFloat(basePriceStr.replace(/,/g, ''));
        const config = window.CraftifyConfig ? window.CraftifyConfig[productId] : null;

        if (!config || (!config.isTemplateBased && (!config.options || config.options.length === 0))) {
            container.style.display = 'none';
            return;
        }

        const currency = window.ShopifyCurrency || "$";

        // Define isolated state for this specific product
        let state = {
            base_price: basePrice
        };

        const isTemplate = config.isTemplateBased;
        const parameters = isTemplate ? config.parameters : config.options;
        const formula = config.formula || '';

        // Initialize state defaults
        if (parameters) {
            parameters.forEach(opt => {
                if (opt.type === 'number') {
                    state[opt.id] = parseFloat(opt.defaultValue) || opt.min || 0;
                } else if (opt.options && opt.options.length > 0) {
                    state[opt.id] = opt.options[0].value;
                }
            });
        }

        // Custom math evaluator mapping string tags like "[width]" to state values
        const evaluateMath = (equation) => {
            let evalString = equation;
            if (!evalString) return basePrice;

            // replace variables
            for (const [key, val] of Object.entries(state)) {
                let actualVal = val;
                // If it's a dropdown, look up its numeric rate if configured
                const paramConfig = parameters.find(p => p.id === key);
                if (paramConfig && paramConfig.options) {
                    const selected = paramConfig.options.find(o => o.value === val);
                    // For dropdowns, if it has a priceRate use it for math, else just use 0
                    if (selected && selected.priceRate !== undefined) {
                        actualVal = selected.priceRate;
                    }
                }

                evalString = evalString.replace(new RegExp(`\\[${key}\\]`, 'g'), actualVal);
                evalString = evalString.replace(new RegExp(key, 'g'), actualVal); // fallback for raw text
            }

            try {
                // simple safe eval fallback for arithmetic
                const price = new Function('return ' + evalString)();
                return isNaN(price) ? basePrice : price;
            } catch (e) {
                return basePrice;
            }
        };

        const render = () => {
            let html = `<div class="craftify-template-engine">`;

            if (isTemplate && parameters) {
                parameters.forEach(opt => {
                    html += `<div class="craftify-param-group">`;
                    html += `<label class="craftify-param-label">${opt.label} ${opt.required ? '<span class="text-rose-500">*</span>' : ''}</label>`;

                    if (opt.type === 'number') {
                        html += `
                            <div class="craftify-input-wrapper">
                                <input type="number" 
                                       min="${opt.min || ''}" 
                                       max="${opt.max || ''}" 
                                       value="${state[opt.id]}" 
                                       oninput="window.CraftifyUpdate('${productId}', '${opt.id}', this.value)"
                                       class="craftify-input-field" />
                                ${opt.unit ? `<span class="craftify-unit">${opt.unit}</span>` : ''}
                            </div>
                        `;
                    } else if (opt.type === 'dropdown') {
                        html += `
                            <select class="craftify-select-field" onchange="window.CraftifyUpdate('${productId}', '${opt.id}', this.value)">
                                ${opt.options.map(o => `
                                    <option value="${o.value}" ${state[opt.id] === o.value ? 'selected' : ''}>
                                        ${o.label} ${o.priceRate ? `(+${currency}${o.priceRate})` : ''}
                                    </option>
                                `).join('')}
                            </select>
                        `;
                    } else if (opt.type === 'checkbox') {
                        html += `
                            <label class="craftify-checkbox-wrap">
                                <input type="checkbox" onchange="window.CraftifyUpdate('${productId}', '${opt.id}', this.checked)" ${state[opt.id] ? 'checked' : ''} />
                                <span>${opt.label}</span>
                            </label>
                        `;
                    }
                    html += `</div>`;
                });
            }

            let finalPrice = basePrice;
            if (isTemplate && formula) {
                finalPrice = evaluateMath(formula);

                // Enforce minimum price from template overrides
                if (config.minimumPrice && finalPrice < config.minimumPrice) {
                    finalPrice = config.minimumPrice;
                }
            }

            html += `
                <div class="craftify-price-summary">
                    <div class="craftify-price-total">
                        <span>Dynamic Total:</span>
                        <span class="craftify-grand-total">${currency}${finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            `;
            html += `</div>`;
            container.innerHTML = html;
        };

        window.CraftifyUpdate = (pId, optId, val) => {
            if (pId === productId) {
                state[optId] = val;
                render();
            }
        };

        render();
    });
});
