import React, { useState } from "react";
import { useDispatch } from "react-redux";
import auth from "../appwrite/auth";
import { login, logout } from "../store/authSlice";
import ClearableInput from "./ClearableInput";
import PasswordInput from "./PasswordInput";
import "./Signup.css"; // Import your CSS file for animations

function Signup() {
	const dispatch = useDispatch();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		password: "",
	});

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const validateEmail = (email) => {
		// Simple email validation using regex
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Simple name validation (not empty)
		if (!name.trim()) {
			setErrors((prevErrors) => ({
				...prevErrors,
				name: "Name cannot be empty.",
			}));
			return;
		} else {
			setErrors((prevErrors) => ({
				...prevErrors,
				name: "",
			}));
		}

		// Simple email validation
		if (!validateEmail(email)) {
			setErrors((prevErrors) => ({
				...prevErrors,
				email: "Please enter a valid email address.",
			}));
			return;
		} else {
			setErrors((prevErrors) => ({
				...prevErrors,
				email: "",
			}));
		}

		// Password validation (minimum 6 characters)
		if (password.length < 6) {
			setErrors((prevErrors) => ({
				...prevErrors,
				password: "Password must be at least 6 characters long.",
			}));
			return;
		} else {
			setErrors((prevErrors) => ({
				...prevErrors,
				password: "",
			}));
		}

		try {
			const acc = await auth.createAccount({
				email: email,
				password: password,
				userName: name,
			});

			if (acc) {
				dispatch(login(acc.$id)); // Assuming login action expects an ID
				// Redirect to dashboard or home page after successful signup
				// Example: navigate("/dashboard");
			} else {
				dispatch(logout()); // Clear state if signup fails
				// Handle errors specific to signup failure (e.g., duplicate email)
				setErrors((prevErrors) => ({
					...prevErrors,
					email: "Error creating account. Please try again.",
				}));
			}
		} catch (error) {
			console.error("Error creating account:", error);
			setErrors((prevErrors) => ({
				...prevErrors,
				email: "Error creating account. Please try again.",
			}));
		}
	};

	return (
		<div className='signup-container m-5'>
			<h2 className='text-3xl font-bold mb-6'>Sign Up</h2>
			<form onSubmit={handleSubmit} className='w-72 space-y-4'>
				<ClearableInput
					type={"text"}
					clearable={true}
					placeholder={"Name"}
					value={name}
					onChange={handleNameChange}
				/>
				{errors.name && (
					<p className='text-red-500 text-xs mt-1'>{errors.name}</p>
				)}
				<ClearableInput
					type={"email"}
					clearable={true}
					placeholder={"Email"}
					value={email}
					onChange={handleEmailChange}
				/>
				{errors.email && (
					<p className='text-red-500 text-xs mt-1'>{errors.email}</p>
				)}
				<PasswordInput
					placeholder={"Password"}
					value={password}
					onChange={handlePasswordChange}
				/>
				{errors.password && (
					<p className='text-red-500 text-xs mt-1'>{errors.password}</p>
				)}
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
				>
					Sign Up
				</button>
			</form>
		</div>
	);
}

export default Signup;
