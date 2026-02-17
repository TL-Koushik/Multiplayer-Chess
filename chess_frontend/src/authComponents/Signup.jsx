import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import auth from "../appwrite/auth";
import { login, logout } from "../store/authSlice";
import ClearableInput from "./ClearableInput";
import PasswordInput from "./PasswordInput";
import "./Signup.css";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!name.trim()) {
      newErrors.name = "Name cannot be empty.";
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email.";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setDisabled(true);

    try {
      const acc = await auth.createAccount({
        email,
        password,
        userName: name,
      });
      
      if (acc) {
        dispatch(login(email));
        navigate("/");
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors((prev) => ({
        ...prev,
        email: "Error creating account.",
      }));
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="signup-container w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Create Account</h2>

        <ClearableInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

        <ClearableInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white py-2 rounded-lg font-semibold transition"
        >
          {disabled ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
