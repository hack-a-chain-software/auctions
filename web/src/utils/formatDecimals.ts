import Big from "big.js";

export const formatDecimals = (
  balance: string | number,
  decimals: number
): Big => {
  return Big(balance).div(Big(10).pow(decimals));
};
