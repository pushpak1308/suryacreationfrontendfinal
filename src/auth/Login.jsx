import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [sending, setSending] = useState(false);

  /* ================= GOOGLE LOGIN ================= */

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleFirebaseUser(result.user);
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  /* ================= RECAPTCHA SETUP ================= */

  const setupRecaptcha = async () => {
    // destroy old verifier safely
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {}
      window.recaptchaVerifier = null;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );

    await window.recaptchaVerifier.render();
  };

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {
    if (phone.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      setSending(true);

      await setupRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.recaptchaVerifier
      );

      setConfirmation(result);
      alert("OTP sent — enter below");
    } catch (err) {
      console.error("OTP SEND ERROR:", err);
      alert(err.message || "Failed to send OTP");
    }

    setSending(false);
  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {
    if (!confirmation) return;

    try {
      const cred = await confirmation.confirm(otp);
      await handleFirebaseUser(cred.user);
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  /* ================= BACKEND VERIFY ================= */

  const handleFirebaseUser = async (user) => {
    const firebaseToken = await user.getIdToken();

    const res = await axios.post(
      "https://surya-creations.onrender.com/api/auth/verify",
      {},
      {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      }
    );

    localStorage.setItem("token", res.data.jwt);

    if (!res.data.profileComplete) {
      navigate("/complete-profile");
    } else {
      navigate("/");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome to Surya Creations</h2>
        <p className="login-subtext">
          Sign in to continue shopping premium personalized gifts
        </p>

        {/* GOOGLE */}
        <button className="google-btn" onClick={googleLogin}>
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <div style={{ margin: "16px 0", opacity: 0.6 }}>OR</div>

        {/* PHONE INPUT */}
        <input
          className="login-input"
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="otp-btn" onClick={sendOtp} disabled={sending}>
          {sending ? "Sending..." : "Send OTP"}
        </button>

        {/* OTP FIELD — shows after send */}
        {confirmation && (
          <>
            <input
              className="login-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="otp-btn" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {/* MUST always exist */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
