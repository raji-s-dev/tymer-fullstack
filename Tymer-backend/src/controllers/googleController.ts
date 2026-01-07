import { OAuth2Client } from "google-auth-library";
import { db } from "../config/db";
import { generateToken } from "../utils/generateToken";

const googleClient = new OAuth2Client(process.env.GOOGLE_LOGIN_CLIENT_ID);

export const googleLogin = async (req: any, res: any) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_LOGIN_CLIENT_ID, // ✅ FIXED

      
    });
    
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: "Invalid Google payload" });

    const { sub: googleId, email, name, picture } = payload;

    let user = await db.query("SELECT * FROM users WHERE google_id=$1", [googleId]);

    if (user.rows.length === 0) {
      user = await db.query(
        "INSERT INTO users (google_id,email,name,picture,is_verified) VALUES ($1,$2,$3,$4,true) RETURNING *",
        [googleId, email, name, picture]
      );
    }

    const token = generateToken(user.rows[0].id);

    return res.json({ message: "Login successful", token, user: user.rows[0] });

  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
