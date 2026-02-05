import React from "react";
import { useState } from "react";
import { apiFetch } from "../api/api";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      const ress = await apiFetch("/auth/signUp", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log(ress);
      if (ress.message === "Success") {
        window.location.href = "/";
      } else {
        setErrors(ress.errors);
      }
    } catch (err) {
      setErrors(err?.errors || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      {errors && <p style={{ color: "red" }}>{errors}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Create Account</button>
    </form>
  );
}
