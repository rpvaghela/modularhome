# Hardcoded Product Data Audit

## Findings
- **Bypassed Hardcoded Models**: Removed legacy static array overrides in favor of dynamic resolution via `src/lib/publicData.ts` and `src/data/all_products_catalog.json`.
- **Dynamic Bindings**:
  - `BuildingCard.tsx`: Consumes model `sqft`, `bedrooms`, `bathrooms`, `startingPrice`, and `primaryImage`.
  - `ModelDetailClient.tsx`: Consumes model variants, architectural specs, and floor plan schematic validation.
  - `pricingEngine.ts`: Consumes verified base price and variant SKU options.
