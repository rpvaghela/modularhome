import { BuildingModel } from "@/data/models";

/**
 * Keep products with a verified square-foot value ahead of custom/no-sqft
 * products without changing the existing order within either group.
 */
export function sortBySqftAvailability(products: BuildingModel[]): BuildingModel[] {
  return products
    .map((product, index) => ({ product, index }))
    .sort((a, b) => {
      const aHasSqft = Number(a.product.sqft) > 0;
      const bHasSqft = Number(b.product.sqft) > 0;

      if (aHasSqft !== bHasSqft) return aHasSqft ? -1 : 1;
      return a.index - b.index;
    })
    .map(({ product }) => product);
}
