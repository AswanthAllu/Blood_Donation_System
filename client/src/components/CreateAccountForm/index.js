// src/components/CreateAccountForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

const CreateAccountForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    bloodGroup: "",
    mobileNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup/", formData);
      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="signup-container d-flex justify-content-center align-items-center vh-100">
      <div className="sign-up-container p-4 shadow-lg bg-light rounded">
        <form onSubmit={handleSubmit}>
          <h1 className="signup-head mt-2 text-center">Complete Your Registration</h1>

          {["name", "email", "password", "age", "mobileNumber"].map((field) => (
            <div key={field} className="form-group">
              <input
                className="form-control shadow-sm"
                type={field === "password" ? "password" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group:</label>
            <select
              className="form-control shadow-sm"
              name="bloodGroup"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-danger btn-block mt-3">Register</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountForm;
