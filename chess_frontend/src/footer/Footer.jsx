import React from "react";

function Footer() {
	return (
		<footer className='absolute bottom-0 w-full bg-gray-700 text-white'>
			<section className='container mx-auto px-4 py-4 flex items-center justify-between'>
				{/* Social Media Icons */}
				<div className='flex items-center space-x-4'>
					<a
						href='#'
						className='flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-300'
					>
						<svg
							width='16'
							height='16'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M9.38071 3.2L9.38071 1.456C9.38071 1.164 9.47945 1.056 10.1883 1.056H11.8598V0.48L10.4711 0.48C8.72462 0.48 7.83898 1.056 7.83898 2.112L7.83898 3.2H5.50068L5.50068 5.6H7.20998L7.83898 8.88H8.62373L9.38071 5.6H10.9393L11.108 3.2H9.38071ZM12.1691 0L12.0316 0C12.3673 0 12.6053 0.2824 12.6053 0.7528L12.6053 12.2472C12.6053 12.7176 12.3673 13 12.0316 13L3.75918 13C3.42345 13 3.18542 12.7176 3.18542 12.2472L3.18542 0.7528C3.18542 0.2824 3.42345 0 3.75918 0L3.62169 0C3.95742 0 4.19544 0.2824 4.19544 0.7528L4.19544 10.9608C4.19544 11.1792 4.29699 11.2872 4.51591 11.2872L11.0544 11.2872C11.2733 11.2872 11.3749 11.1792 11.3749 10.9608L11.3749 2.1608C11.3749 1.9424 11.2733 1.8344 11.0544 1.8344L8.80014 1.8344L8.80014 3.2076C8.80014 3.426 8.8964 3.5336 9.11532 3.5336L9.89967 3.5336L9.89967 2.064C9.89967 1.7552 9.7736 1.6168 9.42987 1.6168L8.48659 1.6168C7.92638 1.6168 7.8098 2.1112 7.8098 2.488L7.8098 3.5336L6.91701 3.5336C6.67693 3.5336 6.61569 3.66 6.61569 3.8696L6.61569 4.8376L5.62514 4.8376C5.38506 4.8376 5.32382 4.964 5.32382 5.1736L5.32382 6.0648L4.19544 6.0648C3.95536 6.0648 3.89412 6.1912 3.89412 6.4008L3.89412 7.712L3.18542 7.712C2.94534 7.712 2.88409 7.8384 2.88409 8.048L2.88409 9.2168L1.71878 9.2168C1.4787 9.2168 1.41745 9.3432 1.41745 9.5528L1.41745 10.7528C1.41745 11.172 1.63707 11.4168 2.08729 11.4168L12.5128 11.4168C12.963 11.4168 13.1827 11.172 13.1827 10.7528L13.1827 0.7528C13.1827 0.3336 12.963 0 12.5128 0L12.1691 0Z'
								fill='#27272A'
							/>
						</svg>
					</a>
					<a
						href='#'
						className='flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-300'
					>
						<svg
							width='16'
							height='16'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M6.64 0.533993L5.84 1.03399L7.84 3.53399L6.64 5.13399L4.64 2.93399L2.64 4.63399C2.64 4.63399 -0.4 9.13399 6.64 9.13399C13.68 9.13399 14.64 5.13399 14.64 5.13399C14.64 5.13399 15.68 1.73399 6.64 0.533993Z'
								fill='#27272A'
							/>
						</svg>
					</a>
					<a
						href='#'
						className='flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-300'
					>
						<svg
							width='16'
							height='16'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M3.2 0C1.44 0 0 1.44 0 3.2V12.8C0 14.56 1.44 16 3.2 16H12.8C14.56 16 16 14.56 16 12.8V3.2C16 1.44 14.56 0 12.8 0H3.2ZM5.12 1.6H10.88V4H5.12V1.6ZM8 13.44C6.24 13.44 4.8 12 4.8 10.24C4.8 8.48 6.24 7.04 8 7.04C9.76 7.04 11.2 8.48 11.2 10.24C11.2 12 9.76 13.44 8 13.44ZM12.8 4H10.88V1.6H12.8V4Z'
								fill='#27272A'
							/>
						</svg>
					</a>
				</div>
				{/* Privacy and Terms Text */}
				<div className='text-sm text-gray-400'>
					<p>Privacy Policy | Terms of Service</p>
				</div>
			</section>
		</footer>
	);
}

export default Footer;
