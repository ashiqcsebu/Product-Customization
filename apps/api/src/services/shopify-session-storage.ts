import { SessionStorage } from "@shopify/shopify-app-express";
import { Session } from "@shopify/shopify-api";
import { ShopifySession } from "@shabu/database";

export class MongooseSessionStorage implements SessionStorage {
    public async storeSession(session: Session): Promise<boolean> {
        try {
            await ShopifySession.findOneAndUpdate(
                { id: session.id },
                {
                    id: session.id,
                    shop: session.shop,
                    state: session.state,
                    isOnline: session.isOnline,
                    scope: session.scope,
                    expires: session.expires,
                    accessToken: session.accessToken,
                    onlineAccessInfo: session.onlineAccessInfo,
                },
                { upsert: true }
            );
            return true;
        } catch (error) {
            console.error("Failed to store Shopify session:", error);
            return false;
        }
    }

    public async loadSession(id: string): Promise<Session | undefined> {
        try {
            const doc = await ShopifySession.findOne({ id }).lean();
            if (!doc) return undefined;
            const session = new Session({
                id: doc.id,
                shop: doc.shop,
                state: doc.state,
                isOnline: doc.isOnline,
                scope: doc.scope,
                expires: doc.expires ? new Date(doc.expires) : undefined,
                accessToken: doc.accessToken,
                onlineAccessInfo: doc.onlineAccessInfo as any,
            });
            return session;
        } catch (error) {
            console.error("Failed to load Shopify session:", error);
            return undefined;
        }
    }

    public async deleteSession(id: string): Promise<boolean> {
        try {
            await ShopifySession.findOneAndDelete({ id });
            return true;
        } catch (error) {
            console.error("Failed to delete Shopify session:", error);
            return false;
        }
    }

    public async deleteSessions(ids: string[]): Promise<boolean> {
        try {
            await ShopifySession.deleteMany({ id: { $in: ids } });
            return true;
        } catch (error) {
            console.error("Failed to delete multiple Shopify sessions:", error);
            return false;
        }
    }

    public async findSessionsByShop(shop: string): Promise<Session[]> {
        try {
            const docs = await ShopifySession.find({ shop }).lean();
            return docs.map((doc) => {
                return new Session({
                    id: doc.id,
                    shop: doc.shop,
                    state: doc.state,
                    isOnline: doc.isOnline,
                    scope: doc.scope,
                    expires: doc.expires ? new Date(doc.expires) : undefined,
                    accessToken: doc.accessToken,
                    onlineAccessInfo: doc.onlineAccessInfo as any,
                });
            });
        } catch (error) {
            console.error("Failed to find Shopify sessions by shop:", error);
            return [];
        }
    }
}
