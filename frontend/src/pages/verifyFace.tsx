import { useRef, useState, useContext, useEffect } from "react";
import bgImage from "../assets/login.png";
import { BaseURL } from "../components/api";
import { useNavigate } from "react-router";
import { UserContext } from "../context/provider";

export const FaceVerify = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const tempToken = sessionStorage.getItem("tempToken");

  useEffect(() => {
    if (!tempToken) {
      navigate("/login");
    }
  }, [tempToken, navigate]);

  // ---------------- START CAMERA ----------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setResult("Camera access denied.");
    }
  };

  // ---------------- CAPTURE IMAGE ----------------
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const MAX_WIDTH = 300;
    const MAX_HEIGHT = 300;

    let width = videoRef.current.videoWidth;
    let height = videoRef.current.videoHeight;

    // Maintain aspect ratio
    if (width > height) {
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = (width * MAX_HEIGHT) / height;
        height = MAX_HEIGHT;
      }
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, width, height);

    // Convert canvas to Blob
    canvasRef.current.toBlob((blob) => {
      if (blob) setCapturedImage(blob);
    }, "image/jpeg", 1);

    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  // ---------------- VERIFY FACE ----------------
  const verifyFace = async () => {
    if (!capturedImage) {
      setResult("Please capture your face first.");
      return;
    }

    if (!tempToken) {
      setResult("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", capturedImage, "selfie.jpg"); // Field name must match Multer

      const res = await fetch(`${BaseURL}/auth/compare_face`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tempToken}`, // DO NOT set Content-Type; browser handles it
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Face verification failed");
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        token: data.token || data.user.token,
      };

      dispatch({ type: "Login", payload: userData });
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("tempToken");

      setResult("✅ Face Verified Successfully");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1000);
    } catch (err: any) {
      setResult(`❌ ${err.message} ${err.luxandResult}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
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
              src={URL.createObjectURL(capturedImage)}
              alt="Captured"
              className="w-full rounded-lg mb-4"
            />
          )}

          <div className="flex flex-col gap-3">
            {!capturedImage ? (
              <>
                <button onClick={startCamera} className="w-full py-2 bg-gray-600 rounded-lg">
                  Start Camera
                </button>
                <button onClick={captureImage} className="w-full py-2 bg-blue-500 rounded-lg">
                  Capture Face
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setCapturedImage(null)} className="w-full py-2 bg-yellow-500 rounded-lg">
                  Retake
                </button>
                <button
                  onClick={verifyFace}
                  disabled={loading}
                  className="w-full py-2 bg-green-600 rounded-lg disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify Face"}
                </button>
              </>
            )}
          </div>

          {result && <p className="mt-4 text-center font-semibold">{result}</p>}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black px-6 py-4 rounded-xl shadow-xl">
            <p className="animate-pulse font-semibold text-center">Verifying Face...</p>
            <p className="animate-pulse font-semibold text-center">
              We are collecting your biometric to verify if it's you. This may take a while.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};