import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="login-page-container">
      <nav className="navbar">
        <div className="logo">
            <img src="src/assets/attend.png" alt="" width='60'/>
        </div>
        <div className="nav-left">
        </div>
        <div className="nav-center">
          <Link to="/login" className="nav-link active">Home</Link>
          <a className="nav-link">About</a>
        </div>
        <div className="nav-right">
          <Link to="/login" className="btn-login">Log In</Link>
          <Link to="/register" className="btn-enroll">Enroll Now</Link>
        </div>
      </nav>

      <div className="background-shape"></div>
      

      <div className="login-box">
        <h2>Log In</h2>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password">Forgot password?</div>

          <button type="submit" className="btn-submit">Log In</button>
        </form>

        <div className="signup-text">
          Don’t have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}
