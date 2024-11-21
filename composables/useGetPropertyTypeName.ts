const getContractStatusName = (s: number) => {
  switch (s) {
    case 1:
      return "شقة سكنية للبيع";
      break;
    case 2:
      return "شقة استثمارية للبيع";
      break;
    case 3:
      return "شقة سكنية للايجار";
      break;
    case 4:
      return "ارض للبيع";
      break;
    case 5:
      return "ارض للايجار";
      break;
    case 6:
      return "فيلا للبيع";
      break;
    case 7:
      return "فيلا للايجار";
      break;
    case 8:
      return "مزرعة للبيع";
      break;
    case 9:
      return "مزرعة للايجار";
      break;
    default:
      break;
  }
};
export default getContractStatusName;
