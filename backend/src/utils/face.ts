import * as faceapi from "face-api.js";
import * as canvas from "canvas";
import path from "path";
import fs from "fs";
import axios from "axios";
// import '@tensorflow/tfjs-node'; // important for Node.js
import * as tf from '@tensorflow/tfjs'
const { Canvas, Image, ImageData } = canvas;

// Monkey patch face-api.js for Node environment
faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any,
});

const MODEL_URL = path.join(__dirname, "face-api-models");

// ✅ Load all face-api models safely
export let modelsLoaded = false;
export async function loadFaceModels() {
  try {
    if (!fs.existsSync(MODEL_URL)) {
      throw new Error(`Model folder not found at: ${MODEL_URL}`);
    }

    console.log("Loading face-api models...");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

    modelsLoaded = true;
    console.log("Face models loaded successfully ✅");
  } catch (err) {
    console.error("Failed to load face-api models:", err);
  }
}

// Load image from Base64 string
export async function loadImageFromBase64(base64: string) {
  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
  return await canvas.loadImage(buffer);
}

// Load image from URL
export async function loadImageFromUrl(url: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");
  return await canvas.loadImage(buffer);
}

// Compare two faces and return similarity %
export async function getFaceSimilarity(img1: any, img2: any) {
  if (!modelsLoaded) throw new Error("Face models not loaded yet");

  const detection1 = await faceapi
    .detectSingleFace(img1)
    .withFaceLandmarks()
    .withFaceDescriptor();

  const detection2 = await faceapi
    .detectSingleFace(img2)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection1 || !detection2) {
    throw new Error("Face not detected in one of the images");
  }

  const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor);

  return Math.max(0, 1 - distance) * 100;
}