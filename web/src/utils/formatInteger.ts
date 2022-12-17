import Big from "big.js";

export const formatInteger = (bid: string | null, decimals: number) => {
  return Big(bid || 0).mul(Big(10).pow(decimals));
};
