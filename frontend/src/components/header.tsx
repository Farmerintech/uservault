
/* ================= HEADER ================= */

import { Link } from "react-router";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="UserVault Logo"
            className="w-12 h-24 object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-200">
          <a href="#features" className="hover:text-indigo-500">Features</a>
          <a href="#pricing" className="hover:text-indigo-500">Pricing</a>
          <a href="#about" className="hover:text-indigo-500">About</a>
          <a href="#contact" className="hover:text-indigo-500">Contact</a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-3">
          <button className="px-4 py-2 text-sm rounded-lg border border-slate-700 hover:border-green-500">
            <Link to="/signin" className="text-white">Login</Link>
          </button>
          <button className="px-4 py-2 text-sm rounded-lg bg-[#46B35C] hover:bg-green-600">
            <Link to="/signup" className="text-white">Get Started</Link>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-200 focus:outline-none"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-slate-200">
            <a href="#features" onClick={() => setOpen(false)} className="hover:text-indigo-500">
              Features
            </a>
            <a href="#pricing" onClick={() => setOpen(false)} className="hover:text-indigo-500">
              Pricing
            </a>
            <a href="#about" onClick={() => setOpen(false)} className="hover:text-indigo-500">
              About
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="hover:text-indigo-500">
              Contact
            </a>

            <div className="pt-4 flex flex-col space-y-3 border-t border-slate-800">
              <button className="py-2 rounded-lg border border-slate-700 hover:border-green-500">
                <Link to="/signin" className="text-white">Login</Link>

              </button>
              <button className="py-2 rounded-lg bg-[#46B35C] hover:bg-green-600">
              <Link to="/signup" className="text-white">Get Started</Link>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}




/* ================= FOOTER ================= */

export const Footer =()=>{
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <h4 className="lg:text-xl md:text-lg font-bold text-[#46B35C] mb-3">UserVault</h4>
          <p className="text-sm">Smart connectivity platform.</p>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-white">Product</h5>
          <ul className="space-y-2 text-sm">
            <li>Features</li>
            <li>Pricing</li>
            <li>Integrations</li>
            <li>Updates</li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-white">Company</h5>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Press</li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-white">Contact</h5>
          <ul className="space-y-2 text-sm">
            <li>support@uservolte.com</li>
            <li>+234 000 000 0000</li>
            <li>Nigeria</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-sm mt-10">© 2026 UserVolte. All rights reserved.</p>
    </footer>
  );
}


