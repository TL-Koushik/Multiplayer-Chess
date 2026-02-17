import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import auth from "../appwrite/auth";
import Spinner from "../Spinner";
import { login, logout } from "../store/authSlice";
import ClearableInput from "./ClearableInput";
import PasswordInput from "./PasswordInput";
import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const acc = await auth.login({ email, password });

      if (acc) {
        dispatch(login(acc.email));
        navigate("/");
      } else {
        dispatch(logout());
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative">

      {/* Spinner Overlay */}
      {loading && <Spinner />}

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="login-container w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center">Sign In</h2>

        <ClearableInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
