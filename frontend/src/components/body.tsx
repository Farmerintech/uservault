/* ================= MAIN ================= */

export default function Main() {
  return (
    <main className="pt-32 text-slate-100 bg-slate-950 overflow-hidden pl-0">
      {/* Hero */}
      <section className="pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-green-500/20" />

        <div className="max-w-7xl mx-auto px-6 relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Powering Smart <span className="text-[#46B35C]">Connectivity</span>
              <br /> for the Future
            </h2>

            <p className="text-slate-400 text-lg mb-8 max-w-xl">
              Manage users, data, and communication with secure, scalable solutions.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button className="px-6 py-3 rounded-xl bg-[#46B35C] hover:bg-green-600">
                Start Free Trial
              </button>
              <button className="px-6 py-3 rounded-xl border border-slate-700 hover:border-[#46B35C]">
                View Demo
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-tr from-indigo-500 to-green-400 p-1 shadow-xl">
            <div className="bg-slate-900 rounded-3xl p-4">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200"
                alt="Dashboard"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose UserVault?
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Fast Performance", "Secure Data", "Smart Analytics", "Cloud Ready", "Team Support", "API Integration"].map(
              (item) => (
                <div
                  key={item}
                  className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-[#46B35C] transition"
                >
                  <h4 className="text-xl font-semibold mb-3">{item}</h4>
                  <p className="text-slate-400">
                    High-quality infrastructure for modern applications.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple Pricing
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900">
              <h4 className="text-xl font-semibold mb-2">Starter</h4>
              <p className="text-3xl font-bold mb-4">$0</p>
              <ul className="space-y-2 text-slate-400 mb-6">
                <li>✔ 1 Project</li>
                <li>✔ Basic Analytics</li>
                <li>✔ Email Support</li>
              </ul>
              <button className="w-full py-2 border border-slate-700 rounded-lg hover:border-[#46B35C]">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border-2 border-[#46B35C] bg-slate-900 scale-105">
              <h4 className="text-xl font-semibold mb-2">Pro</h4>
              <p className="text-3xl font-bold mb-4">$29</p>
              <ul className="space-y-2 text-slate-400 mb-6">
                <li>✔ Unlimited Projects</li>
                <li>✔ Advanced Analytics</li>
                <li>✔ Priority Support</li>
              </ul>
              <button className="w-full py-2 bg-[#46B35C] rounded-lg hover:bg-green-600">
                Choose Plan
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900">
              <h4 className="text-xl font-semibold mb-2">Enterprise</h4>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="space-y-2 text-slate-400 mb-6">
                <li>✔ Dedicated Server</li>
                <li>✔ Custom Integrations</li>
                <li>✔ 24/7 Support</li>
              </ul>
              <button className="w-full py-2 border border-slate-700 rounded-lg hover:border-[#46B35C]">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-[#46B35C]  text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h3>
        <p className="mb-8 text-lg text-white/90">
          Join thousands building smarter systems with UserVolte.
        </p>
        <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100">
          Create Free Account
        </button>
      </section>
    </main>
  );
}
