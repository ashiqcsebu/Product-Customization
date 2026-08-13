import { env } from "../config/env.js";

interface ShopifyGraphQLResponse<T> {
    data?: T;
    errors?: Array<{ message: string }>;
}

export class ShopifyService {
    private static readonly API_URL = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`;

    private static async request<T>(query: string, variables = {}): Promise<T> {
        const response = await fetch(this.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        });

        const json = (await response.json()) as ShopifyGraphQLResponse<T>;

        if (json.errors || !response.ok) {
            console.error("[ShopifyService] GraphQL Error:", json.errors);
            throw new Error("Failed to communicate with Shopify API");
        }

        return json.data as T;
    }

    /**
     * Syncs multiple products from Shopify (useful for initial import)
     */
    public static async fetchProducts(first: number = 50) {
        const query = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              handle
              title
              descriptionHtml
              vendor
              productType
              status
              tags
              options {
                name
                position
                values
              }
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    sku
                    barcode
                    price
                    compareAtPrice
                    inventoryQuantity
                    availableForSale
                    image {
                      url
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

        return this.request<any>(query, { first });
    }

    /**
     * Maps a Shopify GraphQL Global ID (e.g., gid://shopify/Product/123456) to just the numeric/string ID
     */
    public static extractIdFromGid(gid: string): string {
        const parts = gid.split("/");
        return parts[parts.length - 1];
    }
}
