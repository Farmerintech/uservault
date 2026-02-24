import { useRef, useState } from "react";
import bgImage from "../assets/login.png";
import { BaseURL } from "../components/api";
import { useNavigate, useSearchParams } from "react-router";

export const FaceVerify = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [email, setEmail] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // ---------------- START CAMERA ----------------
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // ---------------- CAPTURE ----------------
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imageData = canvasRef.current.toDataURL("image/jpeg");
    setCapturedImage(imageData);

    // stop camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const navigate = useNavigate();

  // ---------------- VERIFY FACE ----------------
  const verifyFace = async () => {
    if (!emailFromQuery || !capturedImage) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BaseURL}/auth/compare_face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:emailFromQuery,
          image: capturedImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      if (data.verified) {
        setResult(`✅ Face Verified (${data.similarity}%)`);
        alert(result)
        navigate(`/user/dashbaord`); // Navigate to dashboard
      } else {
        setResult(`❌ Face Not Matched (${data.similarity}%)`);
      }

    } catch (err: any) {
      setResult(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

          <h2 className="text-3xl font-bold text-center mb-6">
            Face Verification 🔍
          </h2>

          {/* Email */}
          {/* <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-white/20 outline-none"
          /> */}
          {!capturedImage && (

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg border mb-4"
          />)}

          <canvas ref={canvasRef} style={{ display: "none" }} />

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded-lg mb-4"
            />
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={startCamera}
              className="w-full py-2 bg-gray-600 rounded-lg"
            >
              Start Camera
            </button>

            <button
              onClick={captureImage}
              className="w-full py-2 bg-blue-500 rounded-lg"
            >
              Capture Face
            </button>

            <button
              onClick={verifyFace}
              disabled={loading}
              className="w-full py-2 bg-green-600 rounded-lg disabled:opacity-60"
            >
              Verify Face
            </button>
          </div>

          {result && (
            <p className="mt-4 text-center font-semibold">
              {result}
            </p>
          )}

        </div>
      </div>

      {/* 🔥 VERIFYING MODAL */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black px-6 py-4 rounded-xl shadow-xl">
            <p className="animate-pulse font-semibold">
              Verifying Face...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};