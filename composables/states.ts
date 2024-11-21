import type { Ad } from "@prisma/client";

export const useAdsState = async (data: Ad[]) => {
  const ads = useState<Ad[]>("ads", () => []);
  ads.value = data || [];
  return ads;
};
