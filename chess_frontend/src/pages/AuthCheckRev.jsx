import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import auth from "../appwrite/auth";
import { login, logout,setName } from "../store/authSlice";

const AuthCheckRev = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const status = useSelector((state) => state.auth.status);
	const [checkingAuth, setCheckingAuth] = useState(true);
	const location = useLocation();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				if (location.pathname === "/about_us") {
					// navigate(location.pathname);
					return;
				}
				const acc = await auth.getCurrentUser();
				console.log(acc);
				if (acc) {
					const data = acc.email;
					console.log(acc.name);
					dispatch(login(data));
					dispatch(setName(acc.name));
					// Redirect if user is logged in and tries to access /login or /signup
					if (
						location.pathname === "/login" ||
						location.pathname === "/signup"
					) {
						navigate("/");
					}
				} else {
					dispatch(logout());
					// Redirect if user is not logged in and tries to access any page other than /signup
					if (location.pathname !== "/signup") {
						navigate("/login");
					}
				}
			} catch (error) {
				console.error("Error fetching current user:", error);
				dispatch(logout());
				navigate("/login");
			} finally {
				setCheckingAuth(false); // Finish checking authentication
			}
		};

		// Perform auth check if status is not defined (initial check)
		if (!status) {
			checkAuth();
		} else {
			setCheckingAuth(false); // No need to check if already authenticated
		}
	}, [dispatch, navigate, status, location.pathname]);

	// Display spinner while checking authentication
	if (checkingAuth) {
		return <Spinner />;
	}

	// Render children if authentication check is complete
	return children;
};

export default AuthCheckRev;
