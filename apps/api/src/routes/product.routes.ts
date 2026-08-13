import { Router, Request, Response } from "express";
import { Product, ProductVariant, Store } from "@shabu/database";
import { ProductSyncService } from "../services/product-sync.service.js";

const router = Router();

/**
 * Trigger a manual sync from Shopify
 * POST /api/v1/products/sync
 */
router.post("/sync", async (req: Request, res: Response) => {
    try {
        // For now we grab the first store. Later we'll grab from auth token context.
        const store = await Store.findOne();
        if (!store) {
            res.status(404).json({ error: "Store not found. Please create a store first." });
            return;
        }

        const result = await ProductSyncService.syncAllProducts(store._id);
        res.json({ message: "Sync successful", ...result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to sync products from Shopify" });
    }
});

/**
 * Get all products
 * GET /api/v1/products
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
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

export const productRoutes = router;
