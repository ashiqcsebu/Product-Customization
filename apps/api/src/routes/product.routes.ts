import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Product, ProductVariant, Store } from "@shabu/database";
import { ProductSyncService } from "../services/product-sync.service.js";
import { ShopifyService } from "../services/shopify.service.js";

const router = Router();

/**
 * Trigger a manual sync from Shopify
 * POST /api/v1/products/sync
 */
router.post("/sync", async (req: Request, res: Response) => {
    try {
        // For now we grab the first store. Later we'll grab from auth token context.
        let store = await Store.findOne();
        if (!store) {
            const { env } = await import("../config/env.js");
            store = await Store.create({
                name: "Main Store",
                shopDomain: env.SHOPIFY_STORE_DOMAIN || "localhost",
                currency: "USD",
                status: "active"
            });
        }

        const result = await ProductSyncService.syncAllProducts(store._id);
        res.json({ message: "Sync successful", ...result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to sync products from Shopify" });
    }
});

/**
 * Get all products (with pagination, filtering, and embedded stats)
 * GET /api/v1/products
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, status, vendor, type } = req.query;

        let query: any = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (status && status !== 'All') {
            query.status = (status as String).toLowerCase();
        }
        if (vendor) {
            query.vendor = vendor;
        }
        if (type) {
            query.productType = type;
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // Fetch products, stats, and variants concurrently
        const [productsList, totalMatched, stats] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            Product.countDocuments(query),
            Product.aggregate([
                {
                    $group: {
                        _id: null,
                        all: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                        draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
                        archived: { $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] } }
                    }
                }
            ])
        ]);

        // Attach price from variants and featured image
        const productIds = productsList.map(p => p._id);
        const variants = await ProductVariant.find({ productId: { $in: productIds } }).lean();

        const enrichedProducts = productsList.map(product => {
            const productVariants = variants.filter(v => v.productId.toString() === product._id.toString());
            const firstVariant = productVariants[0];
            return {
                ...product,
                featuredImage: product.images?.[0]?.url || null,
                price: firstVariant ? Number(firstVariant.price) : 0,
                compareAtPrice: firstVariant?.compareAtPrice ? Number(firstVariant.compareAtPrice) : null,
                variants: productVariants
            };
        });

        const dashboardStats = stats[0] || { all: 0, active: 0, draft: 0, archived: 0 };

        res.json({
            success: true,
            data: {
                products: enrichedProducts,
                pagination: {
                    total: totalMatched,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(totalMatched / limitNum)
                },
                stats: {
                    all: dashboardStats.all,
                    active: dashboardStats.active,
                    draft: dashboardStats.draft,
                    archived: dashboardStats.archived
                }
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

/**
 * Bulk update pricing for selected products
 * POST /api/v1/products/bulk/pricing
 */
router.post("/bulk/pricing", async (req: Request, res: Response) => {
    try {
        const { productIds, action, value } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0 || !action || typeof value !== 'number') {
            res.status(400).json({ success: false, message: "Invalid payload" });
            return;
        }

        const variants = await ProductVariant.find({ productId: { $in: productIds } });
        let updatedCount = 0;

        for (const variant of variants) {
            let currentPrice = Number(variant.price || "0");

            switch (action) {
                case 'decrease_%':
                    currentPrice = currentPrice - (currentPrice * value / 100);
                    break;
                case 'increase_%':
                    currentPrice = currentPrice + (currentPrice * value / 100);
                    break;
                case 'decrease_fixed':
                    currentPrice = Math.max(0, currentPrice - value);
                    break;
                case 'increase_fixed':
                    currentPrice = currentPrice + value;
                    break;
                case 'set_fixed':
                    currentPrice = Math.max(0, value);
                    break;
            }

            // @ts-ignore
            variant.price = currentPrice.toFixed(2);
            await variant.save();
            updatedCount++;
        }

        res.json({ success: true, variantsUpdated: updatedCount });
    } catch (error) {
        console.error("Error bulk updating pricing:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * Get a specific product with its variants
 * GET /api/v1/products/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        const variants = await ProductVariant.find({ productId: product._id });

        // Return both the product and its injected variants
        res.json({
            ...product.toObject(),
            variants,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product details" });
    }
});



const CustomOptionSchema = new mongoose.Schema({ id: String, type: String, name: String, label: String, required: Boolean, showLabel: Boolean, helpText: String, layout: String, choices: Array }, { _id: false });
const PricingRuleSchema = new mongoose.Schema({ id: String, name: String, status: String, target: String, action: String, value: String, calculationType: String, conditions: Array }, { _id: false });

const ProductCustomizerConfigSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    options: [CustomOptionSchema],
    pricingRules: [PricingRuleSchema],
    templates: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true, strict: false });

const ProductCustomizerConfig = mongoose.models.ProductCustomizerConfig || mongoose.model("ProductCustomizerConfig", ProductCustomizerConfigSchema);

/**
 * Get Product Customizer Config
 * GET /api/v1/products/:id/config
 */
router.get("/:id/config", async (req: Request, res: Response) => {
    try {
        const config = await ProductCustomizerConfig.findOne({ productId: req.params.id });
        if (!config) {
            res.json({ options: [], pricingRules: [], templates: [] });
            return;
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch config" });
    }
});

/**
 * Update Product Customizer Config
 * PUT /api/v1/products/:id/config
 */
router.put("/:id/config", async (req: Request, res: Response) => {
    try {
        const { options, pricingRules, templates } = req.body;

        let config = await ProductCustomizerConfig.findOneAndUpdate(
            { productId: req.params.id },
            { $set: req.body },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Push to Shopify Live Store
        try {
            const product = await Product.findById(req.params.id);
            if (product && product.shopifyProductId) {
                await ShopifyService.pushProductConfigMetafield(
                    product.shopifyProductId,
                    JSON.stringify({
                        useAppVariants: config.useAppVariants,
                        options: config.options,
                        combinations: config.combinations,
                        pricingRules: config.pricingRules
                    })
                );
            }
        } catch (metaErr) {
            console.error("Metafield Sync Error:", metaErr);
        }

        res.json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ error: "Failed to update config" });
    }
});

export const productRoutes = router;
