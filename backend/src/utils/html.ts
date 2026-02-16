export function getOtpEmailHTML(otp: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>UserVault OTP</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #1e293b; margin:0; padding:0; color:#fff; }
  .container { max-width:600px; margin:0 auto; background-color:#0f172a; border-radius:16px; padding:32px; box-shadow:0 0 20px rgba(0,0,0,0.3); text-align:center;}
  .header h1 { color: #46B35C; font-size:28px; margin-bottom:8px;}
  .header p { color:#cbd5e1; font-size:16px; margin-bottom:24px;}
  .otp-boxes { display:flex; justify-content:center; gap:12px; margin:24px 0; }
  .otp-box { width:48px; height:48px; line-height:48px; background-color: rgba(70,179,92,0.1); color:#46B35C; font-size:24px; font-weight:bold; border-radius:8px; text-align:center; border:1px solid #46B35C; }
  .info { color:#cbd5e1; font-size:14px; margin-bottom:24px;}
  .btn { display:inline-block; padding:12px 24px; background-color:#46B35C; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold; margin-top:16px;}
  .footer { font-size:12px; color:#94a3b8; margin-top:24px; }
  @media screen and (max-width:480px){ .otp-box { width:40px; height:40px; line-height:40px; font-size:20px; } }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>UserVault</h1>
      <p>Your secure account verification code</p>
    </div>

    <div class="otp-boxes">
      ${otp.split("").map(d => `<div class="otp-box">${d}</div>`).join("")}
    </div>

    <p class="info">Enter this code in the app to verify your account. The code is valid for 10 minutes.</p>

    <a href="#" class="btn">Go to UserVault</a>

    <p class="footer">If you didn’t request this code, please ignore this email.</p>
  </div>
</body>
</html>
  `;
}



export function getOtpReseHTML(otp: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>UserVault OTP</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #1e293b; margin:0; padding:0; color:#fff; }
  .container { max-width:600px; margin:0 auto; background-color:#0f172a; border-radius:16px; padding:32px; box-shadow:0 0 20px rgba(0,0,0,0.3); text-align:center;}
  .header h1 { color: #46B35C; font-size:28px; margin-bottom:8px;}
  .header p { color:#cbd5e1; font-size:16px; margin-bottom:24px;}
  .otp-boxes { display:flex; justify-content:center; gap:12px; margin:24px 0; }
  .otp-box { width:48px; height:48px; line-height:48px; background-color: rgba(70,179,92,0.1); color:#46B35C; font-size:24px; font-weight:bold; border-radius:8px; text-align:center; border:1px solid #46B35C; }
  .info { color:#cbd5e1; font-size:14px; margin-bottom:24px;}
  .btn { display:inline-block; padding:12px 24px; background-color:#46B35C; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold; margin-top:16px;}
  .footer { font-size:12px; color:#94a3b8; margin-top:24px; }
  @media screen and (max-width:480px){ .otp-box { width:40px; height:40px; line-height:40px; font-size:20px; } }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>UserVault</h1>
      <p>Your secure account verification code</p>
    </div>

    <div class="otp-boxes">
      ${otp.split("").map(d => `<div class="otp-box">${d}</div>`).join("")}
    </div>

    <p class="info">Enter this code in the app to verify your account. The code is valid for 24 hours.</p>

    <a href="#" class="btn">Go to UserVault</a>

    <p class="footer">If you didn’t request this code, please ignore this email.</p>
  </div>
</body>
</html>
  `;
}


export const Resethtml = (resetLink:string) => {
  return ( `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.5;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 20px;
      background-color: #46B35C;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>You recently requested to reset your password. Click the button below to reset it. This link will expire in 10 minutes.</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p class="footer">If you did not request a password reset, please ignore this email.</p>
  </div>
</body>
</html>
`)};
