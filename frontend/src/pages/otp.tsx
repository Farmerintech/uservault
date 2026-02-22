import { useState } from "react";
import bgImage from "../assets/login.png";
import { useNavigate, useSearchParams } from "react-router";
import { BaseURL } from "../components/api";

export const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // New modal state
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (!otp || otp.length !== 6) {
      setMsg("Please enter a 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BaseURL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailFromQuery, otp }),
      });

      const data = await res.json();
  if(data.message == "User is already verified"){
        setShowModal(true);
      }
      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Show modal on success
    
      setShowModal(true);
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleContinue = () => {
    setShowModal(false);
    navigate("/signin"); // Navigate to dashboard
  };
const handleVerifyNow = async () => {
  try {
    // setIsLoading(true);

    const res = await fetch(`${BaseURL}/auth/resend_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailFromQuery}),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message);
      return;
    }

    navigate(`/confirm-otp?email=${emailFromQuery}`);
  } catch {
    // error("Network error");
  } finally {
    setIsLoading(false);
  }
}
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleSubmit}
          className="
            backdrop-blur-xl
            bg-white/10
            border border-white/20
            shadow-2xl
            rounded-2xl
            p-8
            text-white
          "
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Verify OTP</h2>
            <p className="text-white/70 mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {msg && (
            <p className="text-red-400 text-sm mb-4 text-center">{msg}</p>
          )}

          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            placeholder="Enter OTP"
            className="input-glass text-center text-xl tracking-widest mb-6"
          />

          <button
            disabled={isLoading}
            className="
              w-full py-2.5 rounded-lg
              bg-[#46B35C]
              hover:bg-green-600
              font-semibold
              transition
              disabled:opacity-60
              mb-4
            "
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center text-sm text-white/70">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-[#46B35C] font-semibold hover:underline"
              onClick={handleVerifyNow}
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-8 max-w-sm text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-green-600">
              Email Verified Successfully!
            </h3>
            <p className="text-gray-700 mb-6">
              You can now continue to your signin.
            </p>
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-[#46B35C] text-white rounded-lg hover:bg-green-600 font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Input Style */}
      <style>
        {`
          .input-glass {
            width: 100%;
            padding: 0.8rem 1rem;
            border-radius: 0.5rem;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            outline: none;
            transition: all 0.2s ease;
          }

          .input-glass::placeholder {
            color: rgba(255,255,255,0.5);
          }

          .input-glass:focus {
            border-color: #46B35C;
            background: rgba(255,255,255,0.12);
          }
        `}
      </style>
    </div>
  );
};
