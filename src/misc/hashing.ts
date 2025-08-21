import crypto from "crypto";
import bcrypt from "bcryptjs";

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_JWT_SECRET_KEY as string)
  .digest("hex");

const IV_LENGTH = parseInt(process.env.ENCRYPTION_KEY_LENGTH as string, 10);

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text: string): string => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const encryptData = (...texts: string[]): string[] => {
  return texts.map((e) => encrypt(e));
};

export const decryptData = (...texts: string[]): string[] => {
  return texts.map((e) => decrypt(e));
};

export const decryptAndTrim = (value: string) => {
  try {
    const decryptedValue = decrypt(value);
    return decryptedValue.trim();
  } catch (error) {
    throw new Error("Decryption failed");
  }
};

export const compareHashedData = async (
  inputData: string,
  data: string
): Promise<boolean> => {
  return await bcrypt.compare(inputData, data);
};