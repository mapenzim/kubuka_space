export const PRODUCT_DISCOUNT_THRESHOLD = 250;
export const PRODUCT_DISCOUNT_AMOUNT = 20;

export function getProductDiscount(price: number): number {
  return Number.isFinite(price) && price > PRODUCT_DISCOUNT_THRESHOLD
    ? PRODUCT_DISCOUNT_AMOUNT
    : 0;
}

export function getDiscountedUnitPrice(price: number): number {
  const safePrice = Number.isFinite(price) ? Math.max(0, price) : 0;
  return Math.max(0, safePrice - getProductDiscount(safePrice));
}

export function getLineDiscount(price: number, quantity: number): number {
  const safeQuantity = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
  return getProductDiscount(price) * safeQuantity;
}
