import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomChoice {
    id: string;
    label: string;
    priceModifier: number;
}
export interface IPhysicalSize {
    width: number;
    height: number;
    unit: string;
    dpi: number;
}


export interface ICustomOption {
    id: string;
    type: string;
    name: string;
    label: string;
    required: boolean;
    showLabel: boolean;
    helpText?: string;
    layout: string;
    choices: ICustomChoice[];
}

export interface IConfigPricingRule {
    id: string;
    name: string;
    status: string;
    target: string;
    action: string;
    value: string;
    calculationType: string;
    conditions: any[];
}

export interface IProductCustomizerConfig extends Document {
    productId: mongoose.Types.ObjectId;
    options: ICustomOption[];
    pricingRules: IConfigPricingRule[];
    templates: any[];
    createdAt: Date;
    updatedAt: Date;
}

const CustomChoiceSchema = new Schema({
    id: { type: String },
    label: { type: String },
    priceModifier: { type: Number, default: 0 }
}, { _id: false });

const CustomOptionSchema = new Schema({
    id: { type: String },
    type: { type: String },
    name: { type: String },
    label: { type: String },
    required: { type: Boolean, default: false },
    showLabel: { type: Boolean, default: true },
    helpText: { type: String },
    layout: { type: String },
    choices: [CustomChoiceSchema]
}, { _id: false });

const PricingRuleSchema = new Schema({
    id: { type: String },
    name: { type: String },
    status: { type: String },
    target: { type: String },
    action: { type: String },
    value: { type: String },
    calculationType: { type: String },
    conditions: { type: Schema.Types.Mixed, default: [] }
}, { _id: false });

const ProductCustomizerConfigSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    options: [CustomOptionSchema],
    pricingRules: [PricingRuleSchema],
    templates: { type: Schema.Types.Mixed, default: [] }
}, { timestamps: true });

export const ProductCustomizerConfig: Model<IProductCustomizerConfig> =
    mongoose.models.ProductCustomizerConfig ||
    mongoose.model<IProductCustomizerConfig>("ProductCustomizerConfig", ProductCustomizerConfigSchema);
