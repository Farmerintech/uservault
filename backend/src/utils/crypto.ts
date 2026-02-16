import crypto from "crypto";

const algorithm = "aes-256-cbc";

// Convert from hex to Buffer (32 bytes)
const secretKey = Buffer.from(process.env.ENCRYPT_SECRET || "", "hex");

if (!secretKey || secretKey.length !== 32) {
  throw new Error("Invalid ENCRYPT_SECRET length (must be 32 bytes)");
}

const ivLength = 16;

/* ================= ENCRYPT ================= */
export const encryptData = (text: string): string => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

/* ================= DECRYPT ================= */
export const decryptData = (encryptedText: string): string => {
  const parts = encryptedText.split(":");
  if (parts.length !== 2) throw new Error("Invalid encrypted format");

  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
