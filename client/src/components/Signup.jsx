import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "" 
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Signing up...");
    setIsSuccess(false);

    try {
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || "Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Signup failed!");
      }
    } catch (error) {
      setMessage("Error connecting to backend.");
      setIsSuccess(false);
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="username" 
            placeholder="User Name"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            className="form-input"
          />

          <button type="submit" className="submit-button">Sign Up</button>
        </form>

        {message && <p className={`message ${isSuccess ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
