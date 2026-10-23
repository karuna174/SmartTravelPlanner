
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage("Please enter username and password.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await axios.post("http://127.0.0.1:8000/register/", {
        username,
        password,
      });

      setMessage("Registration successful! You can now log in.");
      setSuccess(true);
    } catch (error) {
      const data = error.response?.data;
      const detail = data
        ? Object.values(data).flat().join(" ")
        : "Registration failed. Please try again.";

      setMessage(detail);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary">Create Account 🧳</h1>
          <p className="text-secondary">Start planning your next adventure.</p>
        </div>

        {message && (
          <div className={`alert ${success ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {success && (
          <button
            className="btn btn-outline-success w-100 mt-2"
            onClick={() => navigate("/")}
          >
            Go to Login
          </button>
        )}

        <p className="text-center mt-4 mb-0">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;