import BG from "../assets/side-img.png";

export default function AuthPage({ children }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl  relative">

        {/* Left Side - Illustration */}
        <div className="hidden md:flex items-center justify-center ">
          <img 
            src={BG} 
            alt="Illustration" 
            className="object-contain h-1/2 w-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 bg-yellow-100 rounded-tr-3xl rounded-br-3xl">
          {children}
        </div>

      </div>
    </div>
  );
}
