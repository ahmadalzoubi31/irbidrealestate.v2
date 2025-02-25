export const useGetPropertyTypeName = (s: number) => {
  switch (s) {
    case 1:
      return "شقة سكنية للبيع";
    case 2:
      return "شقة استثمارية للبيع";
    case 3:
      return "شقة سكنية للايجار";
    case 4:
      return "شقة طلابية للايجار";
    case 5:
      return "ارض للبيع";
    case 6:
      return "ارض للايجار";
    case 7:
      return "فيلا للبيع";
    case 8:
      return "فيلا للايجار";
    case 9:
      return "مزرعة للبيع";
    case 10:
      return "مزرعة للايجار";
    case 11:
      return "مخزن للبيع";
    case 12:
      return "مخزن للايجار";
    case 13:
      return "بيت مستقل للبيع";
    case 14:
      return "بيت مستقل للايجار";
    case 15:
      return "مجمع تجاري للبيع";
    case 16:
      return "مجمع تجاري للايجار";
    case 17:
      return "مكاتب للبيع";
    case 18:
      return "مكاتب للايجار";
    default:
      return "غير معروف";
  }
};
