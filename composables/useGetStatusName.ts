const getStatusName = (s: boolean) => {
  if (s) {
    return "نشط";
  } else {
    return "غير نشط";
  }
};

export default getStatusName;
