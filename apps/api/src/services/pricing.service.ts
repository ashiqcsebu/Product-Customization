import { IPricingRule, ICondition, IQuantityTier, IPricingComponent } from "@shabu/database";

export interface PricingVariables {
    [key: string]: number; // e.g. width: 10, height: 20, area: 200, quantity: 5
}

export interface PricingOptions {
    [key: string]: string; // e.g. "Material": "Premium Vinyl"
}

export interface PricingBreakdownItem {
    id: string;
    name: string;
    amount: number;
}

export interface PricingResult {
    subtotal: number;
    discountValue: number;
    finalPrice: number;
    breakdown: PricingBreakdownItem[];
    currency: string;
}

export class PricingEngineError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PricingEngineError";
    }
}

export class PricingService {

    /**
     * Main entry point to calculate price based on user inputs.
     */
    public executeRule(
        rule: any,
        variables: PricingVariables,
        options: PricingOptions
    ): PricingResult {
        // 1. Evaluate Conditions (Guard)
        if (rule.conditionGroups && rule.conditionGroups.length > 0) {
            const matches = this.evaluateConditionGroups(rule.conditionGroups, variables);
            if (!matches) {
                throw new PricingEngineError("Pricing rule conditions are not met for the provided inputs.");
            }
        }

        // 2. Validate Limits
        this.validateLimits(rule.limits, variables);

        // 3. Resolve Components
        const context: Record<string, number> = { ...variables };
        const breakdown: PricingBreakdownItem[] = [];
        let subtotal = 0;

        for (const comp of rule.components) {
            const amount = this.resolveComponentPrice(comp, variables, options);
            context[comp.id] = amount; // Make available for formula

            if (amount > 0) {
                breakdown.push({ id: comp.id, name: comp.name, amount });
                // If there's no formula, we just sum up the components
                if (!rule.formula) {
                    subtotal += amount;
                }
            }
        }

        // 4. Calculate Subtotal via Formula (if present)
        if (rule.formula) {
            subtotal = this.evaluateFormula(rule.formula, context);
        }

        // 5. Apply Quantity Tiers
        let discountValue = 0;
        const qty = variables['quantity'] || 1;
        if (rule.quantityPricing && rule.quantityPricing.enabled && rule.quantityPricing.tiers.length > 0) {
            const tier = this.findMatchingTier(rule.quantityPricing.tiers, qty);
            if (tier) {
                if (tier.discountType === 'percentage') {
                    discountValue = subtotal * (tier.discountValue / 100);
                } else if (tier.discountType === 'fixed') {
                    discountValue = tier.discountValue;
                }
            }
        }

        let finalPrice = subtotal - discountValue;

        // 6. Enforce Min Price
        if (rule.limits && rule.limits.minPrice && finalPrice < rule.limits.minPrice) {
            finalPrice = rule.limits.minPrice;
        }

        // 7. Apply Rounding
        finalPrice = this.applyRounding(finalPrice, rule.roundingRule);

        return {
            subtotal,
            discountValue,
            finalPrice,
            breakdown,
            currency: (rule as any).currency || 'USD'
        };
    }

    private resolveComponentPrice(comp: IPricingComponent, vars: PricingVariables, opts: PricingOptions): number {
        switch (comp.type) {
            case 'fixed':
                return comp.value;
            case 'per_unit':
                // It expects a variable with the same ID, or perhaps 'quantity'
                // Here we assume per_unit means multiplied by quantity, or it could be defined by a formula later
                return comp.value * (vars['quantity'] || 1);
            case 'option_based':
                const selectedOption = opts[comp.name];
                if (comp.optionsMap && selectedOption && comp.optionsMap[selectedOption] !== undefined) {
                    return comp.optionsMap[selectedOption];
                }
                return 0; // Default if not selected or no extra cost
            case 'tiered':
                // Basic implementation of tiered mapping if required
                return 0;
            default:
                return 0;
        }
    }

    private evaluateFormula(formula: string, context: Record<string, number>): number {
        let expression = formula;

        // Replace identifiers with numeric values
        for (const [key, val] of Object.entries(context)) {
            // Regex to match exact word boundary
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            // Ensure negative numbers are wrapped in parentheses to maintain math precedence
            const numStr = val < 0 ? `(${val})` : val.toString();
            expression = expression.replace(regex, numStr);
        }

        // Strict security filtering: Only allow 0-9, dot, math operators, and spaces
        if (/[^0-9\+\-\*\/\(\)\.\s]/.test(expression)) {
            throw new PricingEngineError(`Invalid or missing variable in formula evaluation: ${expression}`);
        }

        try {
            // Note: Since we strictly validated against purely mathematical characters above, 
            // the new Function call is 100% secure from XSS or code injection.
            const result = new Function('return ' + expression)();
            return Number(result);
        } catch (e) {
            throw new PricingEngineError("Failure calculating mathematical formula.");
        }
    }

    private evaluateConditionGroups(groups: any[], vars: PricingVariables): boolean {
        // Evaluate logic (omitted complex tree for brevity, assuming simple AND grouping)
        for (const group of groups) {
            const logic = group.logic; // AND / OR
            let groupResult = logic === 'AND' ? true : false;

            for (const cond of group.conditions) {
                const varValue = vars[cond.variable] || 0;
                const condMet = this.evaluateSingleCondition(varValue, cond.operator, cond.value);

                if (logic === 'AND') {
                    groupResult = groupResult && condMet;
                    if (!groupResult) break;
                } else {
                    groupResult = groupResult || condMet;
                    if (groupResult) break;
                }
            }
            if (!groupResult) return false;
        }
        return true;
    }

    private evaluateSingleCondition(left: number, operator: string, right: any): boolean {
        const rightNum = Number(right);
        switch (operator) {
            case '>': return left > rightNum;
            case '>=': return left >= rightNum;
            case '<': return left < rightNum;
            case '<=': return left <= rightNum;
            case '==': return left === rightNum;
            case '!=': return left !== rightNum;
            default: return false;
        }
    }

    private validateLimits(limits: any, vars: PricingVariables) {
        if (!limits) return;
        if (limits.maxWidth && vars.width && vars.width > limits.maxWidth) throw new PricingEngineError(`Exceeds maximum width of ${limits.maxWidth}`);
        if (limits.maxHeight && vars.height && vars.height > limits.maxHeight) throw new PricingEngineError(`Exceeds maximum height of ${limits.maxHeight}`);
        if (limits.maxArea && vars.area && vars.area > limits.maxArea) throw new PricingEngineError(`Exceeds maximum area of ${limits.maxArea}`);
        if (limits.maxQuantity && vars.quantity && vars.quantity > limits.maxQuantity) throw new PricingEngineError(`Exceeds maximum quantity of ${limits.maxQuantity}`);
    }

    private findMatchingTier(tiers: IQuantityTier[], quantity: number): IQuantityTier | null {
        for (const tier of tiers) {
            if (quantity >= tier.minQuantity) {
                if (tier.maxQuantity === null || quantity <= tier.maxQuantity) {
                    return tier;
                }
            }
        }
        return null;
    }

    private applyRounding(price: number, rule: string): number {
        switch (rule) {
            case 'round_up': return Math.ceil(price);
            case 'round_down': return Math.floor(price);
            case 'nearest_0_01': return Math.round(price * 100) / 100;
            case 'nearest_0_05': return Math.round(price * 20) / 20;
            case 'nearest_0_10': return Math.round(price * 10) / 10;
            case 'nearest_1': return Math.round(price);
            default: return price;
        }
    }
}
