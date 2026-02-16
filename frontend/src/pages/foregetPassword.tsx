import { useState } from "react";
import bgImage from "../assets/login.png";
import { BaseURL } from "../components/api";

export const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);

    if (!email) {
      setMsg("Please enter your email");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BaseURL}/auth/forgot_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send reset link");

      // Show modal on success
      setShowModal(true);
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail(""); // reset input
  };

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
            <h2 className="text-3xl font-bold">Forget Password</h2>
            <p className="text-white/70 mt-2">
              Enter your email and we will send a reset link
            </p>
          </div>

          {msg && (
            <p className="text-red-400 text-sm mb-4 text-center">{msg}</p>
          )}

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-glass mb-6"
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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-8 max-w-sm text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-green-600">
              Reset Link Sent!
            </h3>
            <p className="text-gray-700 mb-6">
              A password reset link has been sent to <strong>{email}</strong>.
              Please check your inbox.
            </p>
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 bg-[#46B35C] text-white rounded-lg hover:bg-green-600 font-semibold"
            >
              Close
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
