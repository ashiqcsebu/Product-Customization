import { Router } from "express";
import { Design, DesignVersion, Product, Store, CustomizerConfig } from "@shabu/database";
import mongoose from "mongoose";

const router = Router();

// Create or save a design
router.post("/", async (req, res) => {
    try {
        const { productId, variantId, canvasData, previewImage } = req.body;

        // Hardcode or lookup basics for the vertical slice
        const product = await Product.findById(productId).populate('storeId').exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const config = await CustomizerConfig.findOne({ productId }).exec();
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }

        // Create a dummy design document to represent the user's session work
        const design = new Design({
            storeId: product.storeId,
            productId: product._id,
            variantId: variantId || new mongoose.Types.ObjectId(),
            customizerConfigId: config._id,
            title: `${product.title} - Custom`,
            status: "cart_locked",
            activeViewKey: "front",
            pricing: {
                productPrice: 19.99,
                customizationPrice: 5.00,
                discount: 0,
                total: 24.99,
                currency: "USD"
            }
        });

        await design.save();

        // Create a frozen version
        const version = new DesignVersion({
            storeId: product.storeId,
            designId: design._id,
            versionNumber: 1,
            source: "add_to_cart",
            productSnapshot: {
                productId: product._id,
                shopifyProductId: (product as any).shopifyProductId || "gid://shopify/Product/123",
                title: product.title
            },
            variantSnapshot: {
                variantId: design.variantId,
                shopifyVariantId: "gid://shopify/ProductVariant/1234567890",
                title: "Default Title",
                options: {}
            },
            pricingSnapshot: {
                basePrice: 19.99,
                charges: [{ key: "customization", label: "Custom Print", quantity: 1, unitPrice: 5.00, total: 5.00 }],
                discount: 0,
                total: 24.99,
                currency: "USD"
            }
        });

        await version.save();

        // Update the design loosely to point to latest version
        design.latestVersionId = version._id;
        await design.save();

        res.status(201).json({
            success: true,
            data: {
                designId: design._id,
                versionId: version._id,
                message: "Design saved successfully for cart."
            }
        });

    } catch (err: any) {
        console.error("Error saving design:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

export default router;
