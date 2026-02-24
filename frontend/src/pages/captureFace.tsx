import { useRef, useState } from "react";
import bgImage from "../assets/login.png";
import { BaseURL } from "../components/api";
import { useNavigate, useSearchParams } from "react-router";

export const FaceRegister = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const { state } = useContext(UserContext);
  const navigate = useNavigate();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  // ✅ NEW STATE
  const [isCaptured, setIsCaptured] = useState(false);

  // ---------------- START CAMERA ----------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      setMsg("Unable to access camera");
    }
  };

  // ---------------- CAPTURE IMAGE ----------------
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
    setIsCaptured(true); // ✅ mark as captured

    // ✅ stop camera after capture
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  // ✅ NEW RETAKE FUNCTION
  const retake = async () => {
    setCapturedImage(null);
    setIsCaptured(false);
    setMsg("");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // ---------------- UPLOAD TO CLOUDINARY ----------------
  const uploadFace = async () => {
    if (!capturedImage) {
      return setMsg("Please capture your face first");
    }

    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("file", capturedImage);
      formData.append("upload_preset", "uploads");
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dtsiyyvu1/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) {
        throw new Error("Cloud upload failed");
      }
      alert(cloudData.secure_url,)
      const saveRes = await fetch(`${BaseURL}/auth/save_face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${state.user.token}`,
        },
        body: JSON.stringify({
          faceImage: cloudData.secure_url,
          email:emailFromQuery
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.message || "Failed to save face");
      }

      alert("Face registered successfully 🎉");
      navigate("signin");

    } catch (err: any) {
      console.error(err);
      setMsg(err.message);
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

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md px-6">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

          <h2 className="text-3xl font-bold text-center mb-6">
            Register Your Face 📸
          </h2>

          {msg && (
            <p className="text-red-400 text-sm mb-4 text-center">{msg}</p>
          )}

          {/* Video */}
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg border mb-4"
          />
        )}
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
              disabled={isCaptured}
              className="w-full py-2 bg-blue-500 rounded-lg disabled:opacity-60"
            >
              Capture Face
            </button>

            {/* ✅ Retake appears only after capture */}
            {isCaptured && (
              <button
                onClick={retake}
                className="w-full py-2 bg-yellow-500 rounded-lg"
              >
                Retake
              </button>
            )}

            <button
              onClick={uploadFace}
              disabled={loading}
              className="w-full py-2 bg-[#46B35C] rounded-lg disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Save Face"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};