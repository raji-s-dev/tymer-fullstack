import { db } from "../config/db";

export const verifyOtp = async (req: any, res: any) => {
  const { email, otp } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!user.rows.length)
      return res.status(400).json({ error: "User not found" });

    if (user.rows[0].otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    await db.query(
      "UPDATE users SET is_verified=true, otp=NULL WHERE email=$1",
      [email]
    );

    res.json({ message: "Email verified successfully!" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
