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

declare interface ICreatePayment {
  apartmentId: number;
  nextRentDate: Date;
  receivedPaymentDate: Date;
  depositAmount: number;
  depositDate: Date;
  notes: string;
}

declare interface IEditPayment {
  receivedPaymentDate: Date;
  depositAmount: number;
  depositDate: Date;
  notes: string;
}

declare interface ICreateAd {
  code: string;
  propertyStatus: string;
  propertyType: number;
  propertyOwnerName: string;
  propertyOwnerNumber: string;
  propertyOwnerIdentity: string;
  propertyAgentName: string | null;
  propertyAgentNumber: string;
  propertyAgentIdentity: string;
  facebookLink: string | null;
  instagramLink: string | null;
  governorate: string;
  directorate: string;
  village: string;
  basin: string;
  plot: string;
  apartmentNumber: string | null;
  classification: string | null;
  neighborhood: string | null;
  expectedRentAmount: string | null;
  notes: string | null;
  interestedPeople: Array<IInterestedPeople>;
}

declare interface IEditAd {
  propertyStatus: string;
  propertyOwnerName: string;
  propertyOwnerNumber: string;
  propertyOwnerIdentity: string;
  propertyAgentName: string | null;
  propertyAgentNumber: string;
  propertyAgentIdentity: string;
  facebookLink: string | null;
  instagramLink: string | null;
  governorate: string;
  directorate: string;
  village: string;
  basin: string;
  plot: string;
  apartmentNumber: string | null;
  classification: string | null;
  neighborhood: string | null;
  expectedRentAmount: string | null;
  notes: string | null;
  interestedPeople: Array<IInterestedPeople>;
}

declare interface IInterestedPeople {
  name: string;
  number: string;
}
