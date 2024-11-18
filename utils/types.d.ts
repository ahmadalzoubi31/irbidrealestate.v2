declare interface ICreateBuilding {
  name: string;
  apartmentsCount: number;
  storeCount: number;
  basinName: string;
  basinNumber: string;
  landNumber: string;
  electricBill: string;
  serviceAmount: number;
  maintenanceAmount: number;
}

declare interface IEditBuilding {
  apartmentsCount: number;
  storeCount: number;
  basinName: string;
  basinNumber: string;
  landNumber: string;
  electricBill: string;
  serviceAmount: number;
  maintenanceAmount: number;
}

declare interface ICreateApartment {
  buildingName: string;
  apartmentNumber: string;
  landNumber: string;
  ownerName: string;
  ownerNumber: string;
  agentName: string;
  agentNumber: string;
  electricSub: string;
  waterSub: string;
  realLocation: string;
  renterName: string;
  renterNumber: string;
  rentDuration: string;
  rentAmount: number;
  rentDate: Date;
  rentPaymentWay: string;
  isFurniture: boolean;
  rentStatus: number;
  renterNationality: string;
  renterIdentification: string;
  isServiceIncluded: boolean;
  insurance: number;
  commissionAmount: number;
}

declare interface IEditApartment {
  ownerName: string;
  ownerNumber: string;
  agentName: string;
  agentNumber: string;
  electricSub: string;
  waterSub: string;
  realLocation: string;
  renterName: string;
  renterNumber: string;
  rentDuration: string;
  rentAmount: number;
  rentDate: Date;
  rentPaymentWay: string;
  isFurniture: boolean;
  rentStatus: number;
  renterNationality: string;
  renterIdentification: string;
  isServiceIncluded: boolean;
  insurance: number;
  commissionAmount: number;
}

declare interface IBrokeApartment {
  renterName: string;
  renterNumber: string;
}
declare interface IExpireApartment {
  renterName: string;
  renterNumber: string;
}
declare interface IRenewApartment {
  renterName: string;
  renterNumber: string;
}
