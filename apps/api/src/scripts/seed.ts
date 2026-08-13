import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Product, Store, ProductVariant } from "@shabu/database";

async function seed() {
    await connectDatabase();
    console.log("Connected to MongoDB for Seeding...");

    // Ensure an active Store exists
    let store = await Store.findOne();
    if (!store) {
        store = await Store.create({
            name: "Demo Store",
            shopDomain: "demo.myshopify.com",
            status: "active"
        });
    }

    // Check if a placeholder product exists
    const existingProduct = await Product.findOne({ handle: "classic-t-shirt" });
    if (!existingProduct) {
        console.log("Creating Placeholder Product...");
        const product = await Product.create({
            storeId: store._id,
            shopifyProductId: "mock-123",
            handle: "classic-t-shirt",
            title: "Premium Classic T-Shirt",
            description: "A comfortable, premium placeholder t-shirt for testing the customizer.",
            vendor: "Shabu Apparel",
            productType: "Apparel",
            status: "active",
            options: [
                { name: "Size", position: 1, values: ["S", "M", "L", "XL"] },
                { name: "Color", position: 2, values: ["White", "Black"] }
            ],
            images: [
                {
                    shopifyImageId: "mock-img-1",
                    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
                    alt: "White T-Shirt Front"
                }
            ],
            tags: ["customizable", "t-shirt"],
            shopifyCreatedAt: new Date(),
            shopifyUpdatedAt: new Date(),
            lastSyncedAt: new Date()
        });

        await ProductVariant.create({
            storeId: store._id,
            productId: product._id,
            shopifyVariantId: "mock-var-1",
            title: "White / M",
            sku: "TSHIRT-WHT-M",
            price: 24.99,
            compareAtPrice: 29.99,
            currency: "USD",
            inventoryQuantity: 100,
            availableForSale: true,
            selectedOptions: { Size: "M", Color: "White" },
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            status: "active",
            lastSyncedAt: new Date()
        });

        console.log("Created successfully!");
    } else {
        console.log("Placeholder product already exists.");
    }

    await disconnectDatabase();
}

seed().catch(console.error);
