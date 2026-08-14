import '@shopify/shopify-api/adapters/node';
import { shopifyApp } from '@shopify/shopify-app-express';
import { ApiVersion } from '@shopify/shopify-api';
import { env } from '../config/env.js';
import { MongooseSessionStorage } from './shopify-session-storage.js';

// This initializes the Shopify App Express middleware and API client for Phase 10
export const shopify = shopifyApp({
    sessionStorage: new MongooseSessionStorage(),
    api: {
        apiVersion: ApiVersion.April25,
        apiKey: env.SHOPIFY_API_KEY,
        apiSecretKey: env.SHOPIFY_API_SECRET,
        scopes: env.SCOPES.split(','),
        hostName: env.SHOPIFY_APP_URL.replace(/https?:\/\//, ''),
    },
    auth: {
        path: '/api/auth',
        callbackPath: '/api/auth/callback',
    },
    webhooks: {
        path: '/api/webhooks',
    },
});
