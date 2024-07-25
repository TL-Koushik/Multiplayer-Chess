import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import auth from "../appwrite/auth";
import { login, logout } from "../store/authSlice";

const AuthCheck = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const status = useSelector((state) => state.auth.status);
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const acc = await auth.getCurrentUser();
				if (acc) {
					const data = acc.email;
					console.log(acc.email);
					dispatch(login(data));
					// navigate("/");
				} else {
					dispatch(logout());
					navigate("/login");
				}
			} catch (error) {
				console.error("Error fetching current user:", error);
				dispatch(logout());
				navigate("/login");
			}
		};
		if (!status) checkAuth();
	}, [dispatch, navigate]);

	return !status ? <Spinner /> : children;
};

export default AuthCheck;
