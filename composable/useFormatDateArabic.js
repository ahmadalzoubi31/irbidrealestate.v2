import { useDateFormat } from "@vueuse/core";

var months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

var days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];
const formatted = (r) => useDateFormat(r, "MM/DD/YYYY").value;

const formatDate = (date) => {
  return `${days[date.getDay()]} - ${formatted(date)}`;
};

export default formatDate;
