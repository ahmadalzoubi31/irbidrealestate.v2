export const useGetContractStatusName = (s: number) => {
  if (s === 0) {
    return "منتهي";
  } else if (s === 1) {
    return "مفسوخ";
  } else if (s === 2) {
    return "مجدد";
  } else {
    return "قائم";
  }
};
