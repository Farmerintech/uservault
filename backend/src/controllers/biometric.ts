// // controllers/webauthn.ts

// import { Request, Response } from "express";
// import {
//   generateRegistrationOptions,
//   GenerateRegistrationOptionsOpts,
// } from "@simplewebauthn/server";
// import users, { IUser } from "../models/users";

// export const generatePasskeyOptions = async (
//   req: any,
//   res: Response
// ): Promise<void> => {
//   const { email } = req.body;

//   const user = await users.findOne({ email });
//   if (!user) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }

//   const options: GenerateRegistrationOptionsOpts =
//     generateRegistrationOptions({
//       rpName: "UserVault",
//       rpID: "localhost", // change in production
//       userID: user._id.toString(),
//       userName: user.email,
//       authenticatorSelection: {
//         authenticatorAttachment: "platform",
//         userVerification: "required",
//       },
//     });

//   req.session.challenge = options.challenge;

//   res.json(options);
// };