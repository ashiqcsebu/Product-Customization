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
   * Syncs multiple products from Shopify (useful for initial import).
   * Handles pagination to fetch ALL products.
   */
  public static async fetchProducts(): Promise<any[]> {
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
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

    let allProducts: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const data: any = await this.request<any>(query, { first: 50, after: cursor });
      const productsPage: any = data.products;
      if (!productsPage) break;

      const nodes = productsPage.edges.map((edge: any) => edge.node);
      allProducts = allProducts.concat(nodes);

      hasNextPage = productsPage.pageInfo.hasNextPage;
      cursor = productsPage.pageInfo.endCursor;
    }

    return allProducts;
  }

  /**
   * Maps a Shopify GraphQL Global ID (e.g., gid://shopify/Product/123456) to just the numeric/string ID
   */
  public static extractIdFromGid(gid: string): string {
    const parts = gid.split("/");
    return parts[parts.length - 1];
  }

  /**
   * Pushes the app configuration to a specific product's metafields in Shopify Admin.
   */
  public static async pushProductConfigMetafield(shopifyProductId: string, configJsonString: string): Promise<any> {
    const query = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      metafields: [
        {
          ownerId: `gid://shopify/Product/${shopifyProductId}`,
          namespace: "craftify",
          key: "customizer_config",
          type: "json",
          value: configJsonString
        }
      ]
    };

    const data: any = await this.request<any>(query, variables);
    if (data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("[ShopifyService] Metafield Error:", data.metafieldsSet.userErrors);
      throw new Error(data.metafieldsSet.userErrors[0].message);
    }

    return data;
  }
}
