import { useEffect } from "react";
import { googleAuth } from "../services/authApi";

declare global {
  interface Window {
    google: any;
  }
}

export default function useGoogleAuth() {
  useEffect(() => {
    let interval = setInterval(() => {
      const btn = document.getElementById("google-login-btn");

      // Wait until both Google SDK is loaded AND our div exists
      if (btn && window.google) {
        window.google.accounts.id.initialize({
          client_id: "266283067618-leo1utdt9t1t8j6n5un8vmn9s9i8ni21.apps.googleusercontent.com",
          callback: async (response: any) => {
            try {
              const { ok, data } = await googleAuth(response.credential);
              if (ok) {
                localStorage.setItem("token", data.token);
                window.location.href = "/dashboard";
              } else {
                alert(data.error || "Google login failed");
              }
            } catch (err) {
              console.error(err);
              alert("Google login failed");
            }
          },
        });

        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: "100%",
        });

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);
}
