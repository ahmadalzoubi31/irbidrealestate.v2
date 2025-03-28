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
  waterBill: string;
  serviceAmount: number;
  servicePaidBy: string;
  serviceTerm: string;
  maintenanceAmount: number;
  maintenancePaidBy: string;
  maintenanceTerm: string;
  realLocation: string;
}

declare interface IEditBuilding {
  name: string;
  apartmentsCount: number;
  storeCount: number;
  basinName: string;
  basinNumber: string;
  landNumber: string;
  electricBill: string;
  waterBill: string;
  serviceAmount: number;
  servicePaidBy: string;
  serviceTerm: string;
  maintenanceAmount: number;
  maintenancePaidBy: string;
  maintenanceTerm: string;
  realLocation: string;
}

declare interface ICreateApartment {
  buildingId: string;
  apartmentNumber: string;
  code: string;
  ownerName: string;
  ownerNumber: string;
  agentName: string;
  agentNumber: string;
  electricSub: string;
  waterSub: string;
  realLocation: string;
  rentDuration: string;
  rentAmount: number;
  rentDate: Date;
  rentPaymentWay: string;
  isFurniture: string;
  rentStatus: number;
  renterInfo: Array<IApartmentRenterInfo>;
  isServiceIncluded: string;
  insurance: number;
  insuranceWithWho: string;
  insuranceType: string;
  commissionAmount: number;
}

declare interface IEditApartment {
  code: string;
  ownerName: string;
  ownerNumber: string;
  agentName: string;
  agentNumber: string;
  electricSub: string;
  waterSub: string;
  realLocation: string;
  rentDuration: string;
  rentAmount: number;
  rentDate: Date;
  rentPaymentWay: string;
  isFurniture: string;
  rentStatus: number;
  renterInfo: Array<IApartmentRenterInfo>;
  isServiceIncluded: string;
  insurance: number;
  insuranceWithWho: string;
  insuranceType: string;
  commissionAmount: number;
}

declare interface IApartmentRenterInfo {
  renterName: string;
  renterNumber: string;
  renterAdditionalNumber: string;
  renterNationality: string;
  renterCountry: string | null;
  renterIdentification: string;
  identificationImage: Image | string;
  contractImage: Image | string;
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
  apartmentId: string;
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
  images: string | null;
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
  area: string | null;
  price: string | null;
  isFurnished: string;
  realLocation: string | null;
  buildingName: string | null;
  nearbyLandmarks: string | null;
  internalArea: string | null;
  externalArea: string | null;
  floor: string | null;
  floorsCount: string | null;
  floorsArea: string | null;
  buildingAge: string | null;
  storesCount: string | null;
  storesArea: string | null;
  isRegistered: string | null;
  notes: string | null;
  interestedPeople: Array<IInterestedPeople>;
}

declare interface IEditAd {
  code: string;
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
  area: string | null;
  price: string | null;
  isFurnished: string;
  realLocation: string | null;
  buildingName: string | null;
  nearbyLandmarks: string | null;
  internalArea: string | null;
  externalArea: string | null;
  floor: string | null;
  floorsCount: string | null;
  floorsArea: string | null;
  buildingAge: string | null;
  storesCount: string | null;
  storesArea: string | null;
  isRegistered: string | null;
  notes: string | null;
  interestedPeople: Array<IInterestedPeople>;
  images: string | null;
}

// declare interface IAppFile {
//   name: string;
//   path: string;
//   type: string;
//   size: string;
//   url: string;
//   key: string;
//   purpose: string;
//   relatedId:string;
//   relatedType: string;
//   adId:string | null;
//   paymentId:string | null;
//   apartmentId:string | null;
// }

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
  specialPrice: number;
  dateTime: Date;
  image: Image | null | string;
}

declare interface ICreateClaim {
  apartmentName: string;
  claimNumber: string;
  claimDate: Date;
  claimFrom: string;
  total: number;
  profit: number;
  clearanceNotes: string;
  claimCollections: Array<ICollection>;
  claimDetails: Array<IDetail>;
  claimStatus: number;
}

declare interface ICreateBuildingFlat {
  buildingId: string;
  flatNumber: string;
  ownerName: string;
  ownerNumber: string | null;
  electricSub: string | null;
  electricCounter: string | null;
  waterSub: string | null;
  waterCounter: string | null;
  renterName: string;
  renterNumber: string | null;
  flatStatus: number;
}

declare interface BuildingWithFlats extends building {
  buildingFlat: buildingFlat[];
}

declare interface ClaimWithDetailsAndCollections extends Claim {
  claimDetails: claimDetail[];
  claimCollections: claimCollection[];
}

declare interface ICreateInterestedPeople {
  name: string;
  number: string;
  adId: string;
}

declare interface Image {
  content:
    | string
    | {
        readonly byteLength: number;
        slice: (begin: number, end?: number | undefined) => ArrayBuffer;
        readonly [Symbol.toStringTag]: string;
      }
    | null
    | undefined;
  name: string;
  lastModified: number;
  readonly size: number;
  readonly type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
  slice: (
    start?: number | undefined,
    end?: number | undefined,
    contentType?: string | undefined
  ) => Blob;
  stream: () => ReadableStream<Uint8Array>;
  text: () => Promise<string>;
}
