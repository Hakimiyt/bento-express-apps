export const PROMOTION_VOUCHER_CODE = "BENTO10";
export const PROMOTION_DISCOUNT_RATE = 0.1;

export const getPromotionPrice = (price) =>
  Number((Number(price) * (1 - PROMOTION_DISCOUNT_RATE)).toFixed(2));
