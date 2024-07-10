export type loginUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  refreshToken: string;
};
type Coordinates = {
  lat: number;
  lng: number;
};

type Address = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
};

type Hair = {
  color: string;
  type: string;
};

type Bank = {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
};

type Company = {
  department: string;
  name: string;
  title: string;
  address: Address;
};

type Crypto = {
  coin: string;
  wallet: string;
  network: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

export type Card = {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};
