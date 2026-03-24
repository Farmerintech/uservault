// // face.ts
// import * as faceapi from "face-api.js";
// import * as canvas from "canvas";
// import path from "path";
// import axios from "axios";

// const { Canvas, Image, ImageData } = canvas;

// // 👇 Patch environment for Node
// faceapi.env.monkeyPatch({
//   Canvas: Canvas as any,
//   Image: Image as any,
//   ImageData: ImageData as any,
// });

// // Models are now in backend root
// const MODEL_PATH = path.join(process.cwd(), "face-api-models");

// export async function loadFaceModels() {
//   try {
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
//     console.log("✅ Face-api models loaded successfully");
//   } catch (err) {
//     console.error("Failed to load face-api models:", err);
//     throw err;
//   }
// }

// // Load image from Base64
// export async function loadImageFromBase64(base64: string) {
//   const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
//   return await canvas.loadImage(buffer);
// }

// // Load image from URL
// export async function loadImageFromUrl(url: string) {
//   const response = await axios.get(url, { responseType: "arraybuffer" });
//   const buffer = Buffer.from(response.data, "binary");
//   return await canvas.loadImage(buffer);
// }

// // Compute similarity
// export async function getFaceSimilarity(img1: any, img2: any) {
//   const detection1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
//   const detection2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();

//   if (!detection1 || !detection2) {
//     throw new Error("Face not detected in one of the images");
//   }

//   const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor);
//   return Math.max(0, 1 - distance) * 100;
// }