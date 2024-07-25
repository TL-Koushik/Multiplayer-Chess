import { EyeIcon, EyeOff } from "lucide-react";
import React, { useState } from "react";

const PasswordInput = ({ placeholder, value, onChange }) => {
	const [showPassword, setShowPassword] = useState(false);

	// Function to toggle password visibility
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className='relative'>
			<input
				type={showPassword ? "text" : "password"}
				className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400'
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
			{/* Show password toggle button */}
			<button
				type='button'
				className='absolute inset-y-0 right-0 px-3 py-2 text-gray-500'
				onClick={togglePasswordVisibility}
			>
				{showPassword ? <EyeIcon /> : <EyeOff />}
			</button>
		</div>
	);
};

export default PasswordInput;
