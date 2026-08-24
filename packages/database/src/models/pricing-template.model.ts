import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParameterOption {
    label: string;
    value: string;
    priceRate?: number;
    pricingType?: "fixed" | "per_sq_ft" | "per_sq_m" | "percentage" | "multiplier";
}

export interface IParameter {
    id: string; // Identifier for formula (e.g., 'width', 'material')
    label: string;
    type: "number" | "text" | "dropdown" | "radio" | "checkbox" | "color" | "image";
    defaultValue?: any;
    required: boolean;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: IParameterOption[];
    helpText?: string;
}

export interface IRuleCondition {
    parameterId: string;
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=";
    value: any;
}

export interface IRuleAction {
    type: "set_price" | "add_fee" | "apply_discount_percentage" | "set_parameter_value";
    targetParameterId?: string; // Optional: Only if modifying another parameter
    value: number;
}

export interface IRule {
    id: string;
    name: string;
    logic: "AND" | "OR";
    conditions: IRuleCondition[];
    actions: IRuleAction[];
}

export interface IPricingTemplate extends Document {
    storeId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    industry?: string;
    productType?: string;
    tags?: string[];

    parameters: IParameter[];
    rules: IRule[];

    formula: string;
    minimumPrice?: number;

    status: "draft" | "active" | "archived";
    createdAt: Date;
    updatedAt: Date;
}

const ParameterOptionSchema = new Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    priceRate: { type: Number },
    pricingType: { type: String, enum: ["fixed", "per_sq_ft", "per_sq_m", "percentage", "multiplier"] }
}, { _id: false });

const ParameterSchema = new Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true, enum: ["number", "text", "dropdown", "radio", "checkbox", "color", "image"] },
    defaultValue: { type: Schema.Types.Mixed },
    required: { type: Boolean, default: false },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    unit: { type: String },
    options: [ParameterOptionSchema],
    helpText: { type: String }
}, { _id: false });

const RuleConditionSchema = new Schema({
    parameterId: { type: String, required: true },
    operator: { type: String, required: true, enum: ["==", "!=", ">", "<", ">=", "<="] },
    value: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const RuleActionSchema = new Schema({
    type: { type: String, required: true, enum: ["set_price", "add_fee", "apply_discount_percentage", "set_parameter_value"] },
    targetParameterId: { type: String },
    value: { type: Number, required: true }
}, { _id: false });

const RuleSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    logic: { type: String, required: true, enum: ["AND", "OR"], default: "AND" },
    conditions: [RuleConditionSchema],
    actions: [RuleActionSchema]
}, { _id: false });

const PricingTemplateSchema = new Schema({
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    description: { type: String },
    industry: { type: String },
    productType: { type: String },
    tags: [{ type: String }],

    parameters: [ParameterSchema],
    rules: [RuleSchema],

    formula: { type: String, default: "" },
    minimumPrice: { type: Number, default: 0 },

    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" }
}, {
    timestamps: true
});

export const PricingTemplate: Model<IPricingTemplate> =
    mongoose.models.PricingTemplate || mongoose.model<IPricingTemplate>("PricingTemplate", PricingTemplateSchema);
