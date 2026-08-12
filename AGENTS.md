# Product Customization Development Rules

This project is a TypeScript monorepo.

## Applications

- apps/web: Next.js frontend
- apps/api: Express.js backend

## Future Applications

- apps/worker: BullMQ background worker

## Packages

Future shared packages will include:

- database
- shared-types
- validation
- canvas-engine
- pricing-engine
- shopify

## Development Rules

- Always use TypeScript.
- Do not use `any` without a valid reason.
- Do not access MongoDB directly from the frontend.
- Keep business logic outside React components.
- Validate API input.
- Do not expose secret keys to the frontend.
- Do not modify unrelated files.
- Run typecheck after implementation.
