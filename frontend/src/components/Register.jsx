import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    idField: "",
    extraField: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);
  };

 
  const getIdLabel = () => {
    if (formData.role === "Student") return "Student ID";
    if (formData.role === "Teacher") return "Teacher ID";
    return "Admin ID";
  };

  const getExtraLabel = () => {
    if (formData.role === "Student") return "Course/Department";
    return "Job Position";
  };

  return (
    <div className="register-page">

      
      <nav className="navbar">
        <div className="logo">
          <img src="src/assets/attend.png" alt="" width="60" />
        </div>

        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <a className="nav-link">About</a>
        </div>

        <div className="nav-right">
          <Link to="/login" className="btn-login">Log In</Link>
          <Link to="/register" className="btn-enroll">Enroll Now</Link>
        </div>
      </nav>

      <div className="register-background"></div>

      <div className="register-box">
        <h2>Create New Account</h2>

        <form onSubmit={handleSubmit}>
          
          
          <div className="full-row">
            <label>Full Name</label>
            <input type="text" name="fullName" onChange={handleChange} />
          </div>

          
          <div className="full-row">
            <label>Email Address</label>
            <input type="email" name="email" onChange={handleChange} />
          </div>

          
          <div className="form-grid">

            
            <div>
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} />
            </div>

            
            <div>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" onChange={handleChange} />
            </div>

            
            <div>
              <label>Select User Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            
            <div>
              <label>{getIdLabel()}</label>
              <input
                type="text"
                name="idField"
                onChange={handleChange}
              />
            </div>

            
            <div>
              <label>{getExtraLabel()}</label>
              <input
                type="text"
                name="extraField"
                onChange={handleChange}
              />
            </div>

            
            <div>
              <label>Contact No.</label>
              <input type="text" name="contact" onChange={handleChange} />
            </div>

          </div>

          <button className="btn-register" type="submit">Register</button>
        </form>

        <div className="login-text">
          Already Have an Account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
