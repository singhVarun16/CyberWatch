import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate(data.user.role === "police" ? "/dashboard" : "/");
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch {
      setMessage("Backend server is not running");
    }
  };

  return (
    <div className="page-small">
      <h1>Login</h1>
      {message && <p className="text-red">{message}</p>}

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="btn btn-primary btn-block">Login</button>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Register Here</Link>
      </p>
    </div>
  );
}

export default Login;