import { useState } from "react";
import bgImage from "../assets/icon.png";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Label } from "../components/ui/label";
import { BaseURL } from "../components/api";

export const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    secondPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  /* ================= HANDLERS ================= */

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const togglePassword = () => setShow((p) => !p);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (!form.username) return error("Username is required");
    if (!form.email) return error("Email is required");
    if (!form.password) return error("Password is required");

    if (form.password.length < 8)
      return error("Password must be at least 8 characters");

    if (form.password !== form.secondPassword)
      return error("Passwords do not match");

    try {
      const res:any = await fetch(`${BaseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
       const data = await res.json();
      console.log(data)
      setMsg(data.message)
      if (!res.ok) throw new Error();

      navigate(`/confirm_email?email=${form.email}`);
    } catch {
      error("Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const error = (text:any) => {
    msg === "" && setMsg(text);
    setIsLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 w-full lg:max-w-xl md:max-w-md px-6">

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
              User<span className="text-[#46B35C]">Vault</span>
            </h2>

            <p className="text-white/70 mt-2">
              Create your account
            </p>
          </div>

          {/* Error */}
          {msg && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {msg}
            </p>
          )}

          {/* Username */}
          <div className="flex gap-5 ">
          <div className="mb-5 w-full">
            <Label className="text-sm mb-1 block">
              Username
            </Label>

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input-glass"
              placeholder="Username"
            />
          </div>

          {/* Email */}
          <div className="mb-5 w-full">
            <Label className="text-sm mb-1 block">
              Email
            </Label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-glass"
              placeholder="Email"
            />
          </div>
</div>
          {/* Password */}
          <div className="mb-5 relative">
            <Label className="text-sm mb-1 block">
              Password
            </Label>

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

          {/* Confirm */}
          <div className="mb-6 relative">
            <Label className="text-sm mb-1 block">
              Confirm Password
            </Label>

            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-9 text-white/60"
            >
              {show ? <FaEye /> : <FaEyeSlash />}
            </button>

            <input
              name="secondPassword"
              value={form.secondPassword}
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
            "
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </button>

          {/* Link */}
          <p className="text-center text-sm mt-5 text-white/70">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[#46B35C] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </div>

      {/* Custom Input Style */}
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
