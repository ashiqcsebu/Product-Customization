import { Router, Request, Response } from "express";
import { ProductCustomizerConfig as CustomizerConfig, Store } from "@shabu/database";

const router = Router();

/**
 * Get Customizer Config for a Specific Product
 * GET /api/v1/config/:productId
 */
router.get("/:productId", async (req: Request, res: Response) => {
    try {
        const config = await CustomizerConfig.findOne({ productId: req.params.productId });
        if (!config) {
            res.status(404).json({ error: "Customizer configuration not found for this product." });
            return;
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch customizer config" });
    }
});

/**
 * Create or Update Customizer Config for a Product
 * POST /api/v1/config/:productId
 */
router.post("/:productId", async (req: Request, res: Response) => {
    try {
        // Determine the current store (dummy lookup for now until auth is added)
        const store = await Store.findOne();
        if (!store) {
            res.status(404).json({ error: "Store not found" });
            return;
        }

        const { productId } = req.params;
        const body = req.body;

        const updatedConfig = await CustomizerConfig.findOneAndUpdate(
            { productId, storeId: store._id },
            {
                $set: {
                    ...body,
                    productId,
                    storeId: store._id
                },
                // Increment version on update automatically
                $inc: { version: 1 }
            },
            { new: true, upsert: true }
        );

        res.json({ message: "Config saved successfully", config: updatedConfig });
    } catch (error: any) {
        console.error("[ConfigApi]", error);
        res.status(500).json({ error: "Failed to save customizer config", details: error?.message || error });
    }
});

export const configRoutes = router;
