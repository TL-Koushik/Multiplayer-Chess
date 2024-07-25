import { XIcon } from "lucide-react";
import React from "react";

const ClearableInput = ({ type, clearable, placeholder, value, onChange }) => {
	// Function to clear input value
	const clearInput = () => {
		onChange({ target: { value: "" } });
	};

	return (
		<div className='relative'>
			<input
				type={type}
				className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400'
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
			{/* Clear button */}
			{clearable && value.length > 0 && (
				<button
					className='absolute inset-y-0 right-0 px-3 py-2 text-gray-500 '
					onClick={clearInput}
				>
					<XIcon />
				</button>
			)}
		</div>
	);
};

export default ClearableInput;
