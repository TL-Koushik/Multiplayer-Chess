import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import auth from "../appwrite/auth";
import Spinner from "../Spinner";
import { login, logout } from "../store/authSlice";
import ClearableInput from "./ClearableInput";
import "./Login.css"; // Import your CSS file for animations
import PasswordInput from "./PasswordInput";

function Login() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const acc = await auth.login({
				email: email,
				password: password,
			});
			if (acc) {
				dispatch(login(acc.$id));
				navigate("/"); // Redirect to homepage after successful login
			} else {
				dispatch(logout());
			}
		} catch (error) {
			console.error("Error logging in:", error);
			setError(
				"There was an error logging into your account. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};
	if (loading) return <Spinner />;
	return (
		<div className='login-container m-5'>
			<h2 className='text-3xl font-bold mb-6'>Login</h2>
			<div className='w-72 space-y-4'>
				<ClearableInput
					type={"email"}
					clearable={true}
					placeholder={"Email"}
					value={email}
					onChange={handleEmailChange}
				/>
				<PasswordInput
					placeholder={"Password"}
					value={password}
					onChange={handlePasswordChange}
				/>
				{error && <p className='text-red-500'>{error}</p>}
				<button
					className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
					onClick={handleSubmit}
				>
					Sign In
				</button>
			</div>
		</div>
	);
}

export default Login;
