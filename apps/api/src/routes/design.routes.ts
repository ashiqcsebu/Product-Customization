import { Router } from "express";
import { Design, DesignVersion, Product, Store, ProductCustomizerConfig as CustomizerConfig, Asset } from "@shabu/database";
import mongoose from "mongoose";

const router = Router();

// Create or save a design
router.post("/", async (req, res) => {
    try {
        const { productId, variantId, canvasData, previewImage, quantity, finalCalculatedPrice } = req.body;

        // Hardcode or lookup basics for the vertical slice
        const product = await Product.findById(productId).populate('storeId').exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const config = await CustomizerConfig.findOne({ productId }).exec();
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }

        const actualPrice = finalCalculatedPrice || 19.99;
        const actualQuantity = quantity || 1;

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
                productPrice: actualPrice,
                customizationPrice: 0,
                discount: 0,
                total: actualPrice * actualQuantity,
                currency: "USD"
            }
        });

        await design.save();

        // Create an Asset for the preview image
        const asset = new Asset({
            storeId: product.storeId,
            ownerType: "design",
            type: "preview",
            originalName: "preview.png",
            mimeType: "image/png",
            extension: "png",
            storageProvider: "local",
            bucket: "local",
            storageKey: "mock-key",
            publicUrl: previewImage, // Base64 for the vertical slice
            metadata: { fileSize: 0 }
        });
        await asset.save();

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
            previewAssetIds: [asset._id],
            pricingSnapshot: {
                basePrice: actualPrice,
                charges: [],
                discount: 0,
                total: actualPrice * actualQuantity,
                currency: "USD"
            }
        });

        await version.save();

        // Update the design loosely to point to latest version
        design.latestVersionId = version._id;
        await design.save();

        // Extract numeric ID from gid://shopify/ProductVariant/12345
        let numericVariantId = "1234567890"; // default mock
        const storeDomain = "your-store.myshopify.com"; // normally from Store config

        res.status(201).json({
            success: true,
            data: {
                designId: design._id.toString(),
                versionId: version._id.toString(),
                shopifyVariantId: numericVariantId,
                storeDomain: storeDomain,
                message: "Design saved successfully for cart."
            }
        });

    } catch (err: any) {
        console.error("Error saving design:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Fetch designs (Orders)
router.get("/", async (req, res) => {
    try {
        const designs = await Design.find()
            .sort({ createdAt: -1 })
            .populate('productId')
            .populate({
                path: 'latestVersionId',
                populate: { path: 'previewAssetIds' }
            })
            .limit(50)
            .exec();

        res.json({
            success: true,
            data: designs
        });
    } catch (err: any) {
        res.status(500).json({ message: "Error fetching designs", error: err.message });
    }
});

export default router;
