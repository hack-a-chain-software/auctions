export const useNftProperties = (data: any) => {
  let nftProperties = [];

  for (const value in data) {
    nftProperties.push({ label: value, value: data[value].value });
  }

  return { nftProperties };
};
