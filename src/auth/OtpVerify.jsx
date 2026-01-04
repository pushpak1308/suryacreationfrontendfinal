import { useState } from "react";
import { getIdToken } from "firebase/auth";
import axios from "axios";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const result = await window.confirmationResult.confirm(otp);
    const token = await getIdToken(result.user);

    const res = await axios.post(
      "http://localhost:8000/api/auth/verify",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.setItem("token", res.data.jwt);
    alert("Login successful");
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}
