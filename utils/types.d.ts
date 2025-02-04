declare interface ICreateUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
}

declare interface IEditUser {
  firstName: string;
  lastName: string;
  role: string;
}

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
  buildingId: number;
  apartmentNumber: string;
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
  isFurniture: string;
  rentStatus: number;
  renterNationality: string;
  renterIdentification: string;
  isServiceIncluded: string;
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
  isFurniture: string;
  rentStatus: number;
  renterNationality: string;
  renterIdentification: string;
  isServiceIncluded: string;
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
  files: Array<any>;
}

declare interface IAppFile {
  name: string;
  path: string;
  type: string;
  size: string;
  url: string;
  key: string;
  purpose: string;
  relatedId: number;
  relatedType: string;
  adId: number | null;
  paymentId: number | null;
  apartmentId: number | null;
}

declare interface IInterestedPeople {
  name: string;
  number: string;
}

declare interface ICreateOrder {
  type: number;
  date: Date;
  ownerName: string;
  ownerNumber: string;
  details: string;
  price: number;
  firstStep: string | null;
  notes: string | null;
}

declare interface IEditOrder {
  type: number;
  date: Date;
  ownerName: string;
  ownerNumber: string;
  details: string;
  price: number;
  firstStep: string | null;
  notes: string | null;
}

declare interface ICollection {
  dateTime: Date;
  payment: number;
  notes: string | null;
}

declare interface IDetail {
  item: string;
  price: number;
  billImage: any;
}

declare interface ICreateClaim {
  apartmentId: number;
  claimDate: Date;
  claimFrom: string;
  total: number;
  claimCollections: Array<ICollection>;
  claimDetails: Array<IDetail>;
}
