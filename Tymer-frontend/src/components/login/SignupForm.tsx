export default function SignupForm({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleSignup,
  switchToLogin,
}: any) {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Create Account
      </h1>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSignup}
        className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Signup
      </button>

      <div id="google-signup-btn" className="mb-4"></div>

      <p className="text-center text-gray-600">
        Already have an account?{" "}
        <span
          onClick={switchToLogin}
          className="text-blue-600 font-semibold cursor-pointer"
        >
          Login
        </span>
      </p>
    </>
  );
}
