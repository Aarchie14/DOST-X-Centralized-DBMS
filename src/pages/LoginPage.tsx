import { useState, useContext, FormEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoCW from "../assets/LogoCW.png";

export default function LoginPage() {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating slight delay for professional feel
    const success = await login(email, password);

    if (!success) {
      alert("Invalid credentials! Try: admin@dost.gov.ph / admin123");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bglogin.png')" }}
    >
      <div className="absolute inset-0 bg-sky-900/20 backdrop-blur-[2px]"></div>

      <form
        onSubmit={handleSubmit} // Handle enter key and submission
        className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-md shadow-2xl w-full max-w-sm text-center"
      >
        <div className="flex flex-col items-center">
          <img
            src={LogoCW}
            alt="DOST Logo"
            className="w-full h-auto object-contain block"
          />
          <h1 className="text-white w-full mt-1 mb-6 font-bold text-lg drop-shadow-md leading-none">
            Centralized Database System
          </h1>
        </div>

        <div className="space-y-4">
          <div className="text-left">
            <label className="text-white text-xs font-bold ml-1 mb-1 block">
              Email
            </label>
            <input
              required
              placeholder="Enter your email"
              type="email" // Better mobile support
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="text-left">
            <label className="text-white text-xs font-bold ml-1 mb-1 block">
              Password
            </label>
            <input
              required
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-md transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
