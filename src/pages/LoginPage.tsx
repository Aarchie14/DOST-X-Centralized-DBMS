import { useState, useEffect, useContext, type FormEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoCW from "../assets/LogoCW.png";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * LoginPage Component
 * Provides an authenticated gateway to the Centralized Database System.
 * Features a glassmorphism aesthetic and loading state handling.
 */
export default function LoginPage() {
  const { login } = useContext(AuthContext)!;

  // --- STATE HOOKS ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Enforce light mode on login screen
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    return () => {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  /**
   * Handles the authentication form submission.
   * Prevents default browser refresh, triggers the auth context login,
   * and manages UI loading states.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    const lockoutUntil = Number(
      sessionStorage.getItem("login_lockout_until") || "0",
    );
    if (Date.now() < lockoutUntil) {
      const remainingSeconds = Math.max(
        1,
        Math.ceil((lockoutUntil - Date.now()) / 1000),
      );
      setErrorMessage(
        `Too many failed attempts. Please try again in ${remainingSeconds}s.`,
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const success = await login(normalizedEmail, trimmedPassword);

    if (!success) {
      const isLocked =
        Number(sessionStorage.getItem("login_lockout_until") || "0") >
        Date.now();
      if (isLocked) {
        const remainingSeconds = Math.max(
          1,
          Math.ceil(
            (Number(sessionStorage.getItem("login_lockout_until") || "0") -
              Date.now()) /
              1000,
          ),
        );
        setErrorMessage(
          `Too many failed attempts. Please try again in ${remainingSeconds}s.`,
        );
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bglogin.png')" }}
    >
      {/* Background Overlay for Glassmorphism Effect */}
      <div className="absolute inset-0 bg-sky-900/20 backdrop-blur-[2px]"></div>

      {/* Login Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-md shadow-2xl w-full max-w-sm text-center"
      >
        {/* Header Section */}
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

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="text-left">
            <label className="text-white text-xs font-bold ml-1 mb-1 block">
              Email
            </label>
            <input
              required
              placeholder="Enter your email"
              type="email"
              autoComplete="username"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          {errorMessage && (
            <p
              className="text-sm text-amber-100 bg-rose-900/50 rounded-md px-3 py-2 text-left"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          )}

          {/* Submit Action */}
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
