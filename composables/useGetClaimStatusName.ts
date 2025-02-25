export const useGetClaimStatusName = (s: number) => {
  if (s === 2) {
    return "جاهزه للتحصيل";
  } else if (s === 3) {
    return "تمت المخالصة";
  } else if (s === 1) {
    return "نشط";
  } else {
    return "غير معروف";
  }
};
