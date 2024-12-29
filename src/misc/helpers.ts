import bcrypt from "bcryptjs";

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