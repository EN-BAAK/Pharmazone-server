import bcrypt from "bcryptjs";
import { Company as CompanyType } from "./types";

export const generateVerificationCode = (): string => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return String(code);
};

export const comparePassword = async (
  enteredPassword: string,
  password: string
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, password);
};

export const getSafeCompany = (company: CompanyType) => {
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
