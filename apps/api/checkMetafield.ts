import { shopifyGraphQL } from "./src/services/shopify.service.ts";
import { Product } from "@shabu/database";
import { dbConnect } from "./src/config/db.ts";

async function test() {
    await dbConnect();
    console.log("Checking Shopify Metafields...");
    // Just get a product from db
    const dbProduct = await Product.findOne({ title: /Short Sleeve/i });
    if (!dbProduct) {
        console.log("Product not found in DB");
        process.exit(1);
    }

    console.log("Found product:", dbProduct.title, dbProduct.shopifyId);

    const query = `
    query {
      product(id: "gid://shopify/Product/${dbProduct.shopifyId}") {
        metafield(namespace: "craftify", key: "customizer_config") {
            id
            value
            type
        }
      }
    }`;

    const res = await shopifyGraphQL(query, dbProduct.storeId.toString());
    console.log("Metafield Data:", JSON.stringify(res, null, 2));
    process.exit(0);
}
test();
