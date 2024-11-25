import type { Building } from "@prisma/client";

export const useBuildingState = () => {
  return useState<Building[]>("buildingData", () => new Array<Building>());
};
