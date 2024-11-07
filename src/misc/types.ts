export type Role = "fac" | "pha";

export type Company = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  rate: number;
  description: string;
  role: Role;
  debtor: string;
  credit: string;
  avatar?: string;
};

export type NewCompany = {
  id: number;
  verificationCode: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: Role;
  requestType: "register" | "verify";
};
