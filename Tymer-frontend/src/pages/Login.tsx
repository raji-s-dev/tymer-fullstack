import { useState } from "react";
import illustration from "../assets/loginpage/illustration.png";
import logo from "../assets/loginpage/logo.png";

import useGoogleAuth from "../hooks/useGoogleAuth";
import { signup, verifyOtp, login } from "../services/authApi";


export default function Login() {
  useGoogleAuth();

  

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<1 | 2>(1); // for OTP step

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ---------------------
  // HANDLE SIGNUP
  // ---------------------
  const handleSignup = async () => {
    const res = await signup(name, email, password);

    const data = await res.json();
    alert(data.error || "Something went wrong");
    if (!res.ok) return;

    setStep(2); // Go to OTP
  };

  // ---------------------
  // VERIFY OTP
  // ---------------------
  const handleVerifyOTP = async () => {
    const res = await verifyOtp(email, otp);
    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      setStep(1);
      setActiveTab("signin"); // move to login after OTP success
    }
  };

  // ---------------------
  // LOGIN
  // ---------------------
  const handleLogin = async () => {
    const res = await login(loginEmail, loginPassword);
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col w-[52%] bg-gradient-to-br from-[#f8fbff] to-white p-10 relative">
        <img src={logo} alt="Logo" className="w-20" />

        <div className="mt-14 rounded-2xl h-[85%] flex items-center justify-center text-[#7d8bb3]">
          <img src={illustration} alt="Login illustration" className="w-3/4 h-3/4 object-contain" />
        </div>

        <div className="absolute bottom-8 left-10 text-[#8d9096] text-sm">
          Time that listens to you.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-[38%] justify-center items-center p-10">
        <div className="w-[420px] bg-white shadow-lg rounded-2xl p-10">

          {/* HEADING */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-3 self-center">
              <h1 className="text-[26px] font-semibold font-poppins leading-tight">
                {activeTab === "signin" ? "Step Back Into" : "Step Into"}
              </h1>
              <img src={logo} alt="Logo" className="w-20 h-8 object-contain translate-y-[1px]" />
            </div>
          </div>

          {/* TABS */}
          {step === 1 && (
            <div className="relative flex bg-[#f1f3f6] rounded-full p-1 mb-8 select-none">
<div
  className={`
    absolute top-1 bottom-1 w-1/2 rounded-full bg-[#1b78ff]
    transition-all duration-500
    ${activeTab === "signin" ? "translate-x-0" : "translate-x-full"}
  `}
/>

              <div
                onClick={() => setActiveTab("signin")}
                className={`flex-1 text-center py-2 font-medium cursor-pointer relative z-10 transition
                  ${activeTab === "signin" ? "text-white" : "text-[#6a6f77]"}`}
              >
                Sign In
              </div>

              <div
                onClick={() => {
                  setActiveTab("signup");
                  setStep(1);
                }}
                className={`flex-1 text-center py-2 font-medium cursor-pointer relative z-10 transition
                  ${activeTab === "signup" ? "text-white" : "text-[#6a6f77]"}`}
              >
                Sign Up
              </div>
            </div>
          )}

          {/* ---------------------------- */}
          {/* SIGN IN FORM */}
          {/* ---------------------------- */}
          {activeTab === "signin" && step === 1 && (
            <>
              {/* EMAIL */}
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm text-[#434a54]">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-xl border border-[#e5e8ec] focus:outline-none 
                    focus:border-[#1b78ff] focus:ring-4 focus:ring-blue-300/20 transition"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col mb-6">
                <label className="mb-1 text-sm text-[#434a54]">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="px-4 py-3 rounded-xl border border-[#e5e8ec] focus:outline-none 
                    focus:border-[#1b78ff] focus:ring-4 focus:ring-blue-300/20 transition"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full h-12 bg-[#1b78ff] text-white rounded-xl font-medium hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Login
              </button>
            </>
          )}

          {/* ---------------------------- */}
          {/* SIGNUP FORM (STEP 1) */}
          {/* ---------------------------- */}
          {activeTab === "signup" && step === 1 && (
            <>
              {/* NAME */}
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm text-[#434a54]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="px-4 py-3 rounded-xl border border-[#e5e8ec] focus:outline-none 
                    focus:border-[#1b78ff] focus:ring-4 focus:ring-blue-300/20 transition"
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm text-[#434a54]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-xl border border-[#e5e8ec] focus:outline-none 
                    focus:border-[#1b78ff] focus:ring-4 focus:ring-blue-300/20 transition"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col mb-6">
                <label className="mb-1 text-sm text-[#434a54]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="px-4 py-3 rounded-xl border border-[#e5e8ec] focus:outline-none 
                    focus:border-[#1b78ff] focus:ring-4 focus:ring-blue-300/20 transition"
                />
              </div>

              <button
                onClick={handleSignup}
                className="w-full h-12 bg-[#1b78ff] text-white rounded-xl font-medium hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Create Account
              </button>
            </>
          )}

          {/* ---------------------------- */}
          {/* OTP STEP (STEP 2) */}
          {/* ---------------------------- */}
          {activeTab === "signup" && step === 2 && (
            <>
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-sm text-[#434a54]">
                  Enter the OTP sent to {email}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="px-4 py-3 rounded-xl border border-[#e5e8ec] focus:outline-none 
                    focus:border-[#1b78ff] focus:ring-4 focus:ring-blue-300/20 transition"
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                className="w-full h-12 bg-[#1b78ff] text-white rounded-xl font-medium hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* ---------------------------- */}
          {/* GOOGLE LOGIN (Only Step 1) */}
          {/* ---------------------------- */}
          {step === 1 && (
            <>
              <div className="relative my-6 text-center">
                <span className="bg-white px-3 text-sm text-gray-500 relative z-10">
                  or continue with
                </span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
              </div>

             <div id="google-login-btn"></div>
            </>
          )}

          <p className="text-center text-[12px] text-gray-400 mt-5">
            By continuing, you agree to our Terms & Privacy.
          </p>

        </div>
      </div>
    </div>
  );
}
