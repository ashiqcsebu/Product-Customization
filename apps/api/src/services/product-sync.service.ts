import { Product, ProductVariant } from "@shabu/database";
import { ShopifyService } from "./shopify.service.js";
import mongoose from "mongoose";

export class ProductSyncService {
    /**
     * Synchronizes all products fetched from Shopify into our MongoDB Atlas database.
     * Ensures variants and options map perfectly.
     */
    public static async syncAllProducts(storeId: mongoose.Types.ObjectId) {
        try {
            console.log("[ProductSync] Starting Shopify Product Sync...");
            const products = await ShopifyService.fetchProducts();
            let syncedCount = 0;

            for (const shopifyProduct of products) {
                const productIdStr = ShopifyService.extractIdFromGid(shopifyProduct.id);

                // 1. Upsert the Product
                const productData = {
                    storeId,
                    shopifyProductId: productIdStr,
                    handle: shopifyProduct.handle,
                    title: shopifyProduct.title,
                    description: shopifyProduct.descriptionHtml,
                    vendor: shopifyProduct.vendor,
                    productType: shopifyProduct.productType,
                    status: shopifyProduct.status.toLowerCase(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    options: shopifyProduct.options.map((opt: any) => ({
                        name: opt.name,
                        position: opt.position,
                        values: opt.values,
                    })),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    images: shopifyProduct.images.edges.map((img: any) => ({
                        shopifyImageId: ShopifyService.extractIdFromGid(img.node.id),
                        url: img.node.url,
                        alt: img.node.altText,
                    })),
                    tags: shopifyProduct.tags || [],
                    shopifyCreatedAt: new Date(shopifyProduct.createdAt),
                    shopifyUpdatedAt: new Date(shopifyProduct.updatedAt),
                    lastSyncedAt: new Date(),
                };

                const updatedProduct = await Product.findOneAndUpdate(
                    { storeId, shopifyProductId: productIdStr },
                    { $set: productData },
                    { upsert: true, new: true }
                );

                // 2. Upsert the Variants
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const variants = shopifyProduct.variants.edges.map((e: any) => e.node) || [];
                for (const shopifyVariant of variants) {
                    const variantIdStr = ShopifyService.extractIdFromGid(shopifyVariant.id);

                    const selectedOptionsMap: Record<string, string> = {};
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    shopifyVariant.selectedOptions.forEach((opt: any) => {
                        selectedOptionsMap[opt.name] = opt.value;
                    });

                    const variantData = {
                        storeId,
                        productId: updatedProduct._id,
                        shopifyVariantId: variantIdStr,
                        title: shopifyVariant.title,
                        sku: shopifyVariant.sku,
                        barcode: shopifyVariant.barcode,
                        selectedOptions: selectedOptionsMap,
                        price: parseFloat(shopifyVariant.price),
                        compareAtPrice: shopifyVariant.compareAtPrice ? parseFloat(shopifyVariant.compareAtPrice) : null,
                        currency: "USD", // Consider dynamic fetching later
                        inventoryQuantity: shopifyVariant.inventoryQuantity || 0,
                        availableForSale: shopifyVariant.availableForSale || false,
                        imageUrl: shopifyVariant.image?.url || null,
                        status: "active", // Shopify GraphQL doesn't explicitly return variant status in basic scope sometimes
                        lastSyncedAt: new Date(),
                    };

                    await ProductVariant.findOneAndUpdate(
                        { storeId, shopifyVariantId: variantIdStr },
                        { $set: variantData },
                        { upsert: true, new: true }
                    );
                }

                syncedCount++;
            }

            console.log(`[ProductSync] Successfully synced ${syncedCount} products and their variants!`);
            return { success: true, count: syncedCount };
        } catch (error: any) {
            console.error("[ProductSync] Sync failed:", error);
            import("fs").then(fs => fs.writeFileSync("sync_error.log", String(error.message || error) + "\n" + String(error.stack)));
            throw error;
        }
    }
}
