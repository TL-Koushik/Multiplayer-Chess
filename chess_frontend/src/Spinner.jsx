// src/Spinner.js
import React from "react";

const Spinner = () => {
	return (
		<div className='flex items-center h-screen w-screen  bg-gray-900 justify-center space-x-2'>
			<div className='w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin'></div>
		</div>
	);
};

export default Spinner;
