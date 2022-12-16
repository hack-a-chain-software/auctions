export const useTimer = (microseconds: number) => {
  const endDate = new Date(microseconds / 1000);
  return { endDate };
};
