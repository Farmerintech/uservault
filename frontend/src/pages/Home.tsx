/* ================= APP ================= */

import Main from "../components/body";
import Header, { Footer } from "../components/header";

export default function Home() {
  return (
    <div className="font-sans bg-slate-950">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}