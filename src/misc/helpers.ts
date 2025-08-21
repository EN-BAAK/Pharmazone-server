import { Companies as CompaniesType } from "../misc/types";

export const generateVerificationCode = (): string => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return String(code);
};

export const getSafeCompany = (company: CompaniesType) => {
  return {
    name: company.name,
    email: company.email,
    phone: company.phone,
    rate: company.rate,
    description: company.description,
    role: company.role,
    debtor: company.debtor,
    credit: company.credit,
    avatar: company.avatar,
  };
};
