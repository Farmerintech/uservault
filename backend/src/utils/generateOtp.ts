/**
 * Generate a 6-digit numeric OTP
 */
export function generateOTP(): string {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // 0-9
  }
  return otp;
}

// Example usage:
