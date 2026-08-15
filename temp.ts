import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOptionChoice {
    label: string;
    value: string;
    colorCode?: string;       // For color swatches
    imageUrl?: string;        // For image swatches
    priceModifier: number;    // E.g., +5.00
    isPercentage: boolean;    // If the price is a percentage of the base price
}

export interface IProductOptionDocument extends Document {
    storeId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    type: string;             // 'text', 'dropdown', 'checkbox', 'radio', 'color_swatch', 'image_swatch', 'date', 'file'
    name: string;             // Internal name e.g., "Color"
    label: string;            // Display name e.g., "Select your Color"
    helpText: string;
    required: boolean;
    priority: number;         // Ordering
    choices: IOptionChoice[]; // Used if type requires choices 
    maxLength?: number;       // For text fields
    minOptions?: number;      // For multi-select / checkboxes
    maxOptions?: number;
}

const OptionChoiceSchema = new Schema<IOptionChoice>({
    label: { type: String, required: true },
    value: { type: String, required: true },
    colorCode: { type: String },
    imageUrl: { type: String },
    priceModifier: { type: Number, default: 0 },
    isPercentage: { type: Boolean, default: false }
});

const ProductOptionSchema = new Schema<IProductOptionDocument>({
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'dropdown', 'checkbox', 'radio', 'color_swatch', 'image_swatch', 'date', 'file', 'number']
    },
    name: { type: String, required: true },
    label: { type: String, required: true },
    helpText: { type: String, default: "" },
    required: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    choices: [OptionChoiceSchema],
    maxLength: { type: Number },
    minOptions: { type: Number },
    maxOptions: { type: Number }
}, {
    timestamps: true
});

export const ProductOption: Model<IProductOptionDocument> =
    mongoose.models.ProductOption || mongoose.model<IProductOptionDocument>("ProductOption", ProductOptionSchema);
