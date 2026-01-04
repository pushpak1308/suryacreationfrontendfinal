import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const firebaseToken = await result.user.getIdToken();

      const res = await axios.post(
        "http://localhost:8000/api/auth/verify",
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
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome to Surya Creations</h2>
        <p className="login-subtext">
          Sign in to continue shopping premium personalized gifts
        </p>

        <button className="google-btn" onClick={googleLogin}>
          <span className="google-icon">G</span>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
