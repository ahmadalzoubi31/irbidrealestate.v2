export const useGetFlatStatusName = (s: number) => {
  if (s === 1) {
    return "فارغة";
  } else if (s === 2) {
    return "مؤجرة";
  } else {
    return "";
  }
};
