import { useContext, useState } from "react";
import bgImage from "../assets/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "../context/provider";
import { BaseURL } from "../components/api";
import { Link, useNavigate } from "react-router";

export const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  /* ================= HANDLERS ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const togglePassword = () => setShow((p) => !p);

  const error = (text: string) => {
   msg ==='' && setMsg(text);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setMsg("");

    if (!form.email) return error("Email is required");
    if (!form.password) return error("Password is required");

    if (form.password.length < 8)
      return error("Password must be at least 8 characters");

    try {
      const res = await fetch(`${BaseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data)
      setMsg(data.message)
      if (!res.ok) throw new Error();

      
      dispatch({ type: "Login", payload: data.user });

      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch {
      error("Invalid credentials or network error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
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

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="text-white/70 mt-2">
              Login to your account
            </p>
          </div>

          {/* Error */}
          {msg && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {msg}
            </p>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="text-sm mb-1 block">
              Email
            </label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-glass"
              placeholder="example@mail.com"
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="text-sm mb-1 block">
              Password
            </label>

            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-9 text-white/60"
            >
              {show ? <FaEye /> : <FaEyeSlash />}
            </button>

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={show ? "text" : "password"}
              className="input-glass pr-10"
              placeholder="********"
            />
          </div>

          {/* Button */}
          <button
            disabled={isLoading}
            className="
              w-full py-2.5 rounded-lg
              bg-[#46B35C]
              hover:bg-green-600
              font-semibold
              transition
              disabled:opacity-60
            "
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* Links */}
          <div className="flex justify-between text-sm mt-5 text-white/70">

            <Link
              to="/forgot-password"
              className="hover:underline"
            >
              Forgot Password?
            </Link>

            <Link
              to="/signup"
              className="text-[#46B35C] font-semibold hover:underline"
            >
              Create Account
            </Link>

          </div>

        </form>
      </div>

      {/* Input Style */}
      <style>
        {`
          .input-glass {
            width: 100%;
            padding: 0.6rem 0.75rem;
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
