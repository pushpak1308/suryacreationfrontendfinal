import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const saveProfile = async () => {
    if (!name.trim() || !address.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://surya-creations.onrender.com/api/user/profile",
        {
          name,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/"); // redirect to home after profile completion
    } catch (error) {
      console.error(error);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Complete Your Profile</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={saveProfile}
        disabled={loading}
        style={{ width: "100%", padding: "10px" }}
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  );
}
