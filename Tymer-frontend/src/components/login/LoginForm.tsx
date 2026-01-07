export default function LoginForm({
  loginEmail,
  loginPassword,
  setLoginEmail,
  setLoginPassword,
  handleLogin,
  switchToSignup,
}: any) {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Welcome Back
      </h1>

      <input
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Password"
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleLogin}
        className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>

      <div id="google-login-btn" className="mb-4"></div>

      <p className="text-center text-gray-600">
        Don’t have an account?{" "}
        <span
          onClick={switchToSignup}
          className="text-blue-600 font-semibold cursor-pointer"
        >
          Signup
        </span>
      </p>
    </>
  );
}
