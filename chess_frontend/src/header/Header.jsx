import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import auth from "../appwrite/auth";
import { logout } from "../store/authSlice";

function Header() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loginStatus = useSelector((state) => state.auth.status);

	const handleLogout = async () => {
		try {
			await auth.logout();
			dispatch(logout());
			navigate("/login");
		} catch (error) {
			console.error("Logout error:", error);
			// Handle logout error (e.g., show error message)
		}
	};

	const navbar = [
		{
			pageName: "Home",
			active: true,
			toLink: "/",
		},
		{
			pageName: "Room",
			active: loginStatus,
			toLink: "/room",
		},
		{
			pageName: "About us",
			active: true,
			toLink: "/about_us",
		},
	];

	return (
		<div className='relative w-full bg-gray-950 shadow-2xl'>
			<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8'>
				<div className='hidden lg:flex justify-center'>
					<ul className='inline-flex space-x-8'>
						{navbar.map(
							(nav, ind) =>
								nav.active && (
									<li key={ind} className='flex-grow'>
										<NavLink
											to={
												loginStatus || nav.pageName === "About us"
													? nav.toLink
													: "/login"
											}
											className={({ isActive }) =>
												isActive ? "text-cyan-300" : "text-gray-300"
											}
										>
											{nav.pageName}
										</NavLink>
									</li>
								)
						)}
					</ul>
				</div>
				<div className='hidden lg:flex space-x-2'>
					{loginStatus ? (
						<>
							<button
								type='button'
								className='rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-300'
								onClick={() => navigate("/profile")}
								aria-label='Profile'
							>
								Profile
							</button>
							<button
								type='button'
								className='rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-300'
								onClick={handleLogout}
								aria-label='Logout'
							>
								Log Out
							</button>
						</>
					) : (
						<>
							<button
								type='button'
								className='rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-300'
								onClick={() => navigate("/signup")}
								aria-label='Sign Up'
							>
								Sign Up
							</button>
							<button
								type='button'
								className='rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-300'
								onClick={() => navigate("/login")}
								aria-label='Log In'
							>
								Log In
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Header;
