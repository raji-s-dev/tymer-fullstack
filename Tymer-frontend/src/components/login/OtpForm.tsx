export default function OtpForm({ otp, setOtp, handleVerifyOTP }: any) {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Verify OTP
      </h1>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleVerifyOTP}
        className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Verify
      </button>
    </>
  );
}
