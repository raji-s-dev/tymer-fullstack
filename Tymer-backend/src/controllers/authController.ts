import { db } from "../config/db";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/generateOtp";

import { hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { sendOtpEmail } from "../config/brevo";

export const signup = async (req: any, res: any) => {
  const { name, email, password } = req.body;

  try {
    const exists = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (exists.rows.length)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await hashPassword(password);
    const otp = generateOtp();

    await db.query(
      "INSERT INTO users (name,email,password,is_verified,otp) VALUES ($1,$2,$3,false,$4)",
      [name, email, hashed, otp]
    );

const sent = await sendOtpEmail(email, otp);
if (!sent) {
  return res.status(500).json({ error: "Failed to send OTP email" });
}

    res.json({ message: "Signup successful! OTP sent to your email." });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const userQuery = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (!userQuery.rows.length)
      return res.status(400).json({ error: "User not found" });

    const user = userQuery.rows[0];

    if (!user.is_verified)
      return res.status(400).json({ error: "Email not verified" });

    if (!user.password)
      return res.status(400).json({ error: "This account does not have a password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password" });

    const token = generateToken(user.id);

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
