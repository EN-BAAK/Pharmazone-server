export type Company = {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  rate?: number;
  description?: string;
  role: string;
  debtor?: string;
  credit?: string;
  avatar?: string;
};

export type CompanyAuth = {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  role: string;
  verificationCode: string;
  requestType: string;
};
