import * as Brevo from "@getbrevo/brevo";


const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Tymer", email: "rajisivappragasam@gmail.com" },
      to: [{ email }],
      subject: "Verify your email",
      textContent: `Your OTP is ${otp}`,
    });

    return true;
  } catch (err) {
    console.log("Email error:", err);
    return false;
  }
};
