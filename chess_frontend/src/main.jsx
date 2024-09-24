import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./authComponents/Login.jsx";
import Signup from "./authComponents/Signup.jsx";
import "./index.css";
import About from "./pages/About.jsx";
import AuthCheck from "./pages/AuthCheck.jsx";
import AuthCheckRev from "./pages/AuthCheckRev.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Game from "./pages/Game.jsx";
import Room from "./pages/Room.jsx";
import HomePage from "./pages/homePage.jsx";
import store from "./store/store.js";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<AuthCheckRev>
				<Home />
			</AuthCheckRev>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <HomePage />,
				children: [
					{
						path: "/login",
						element: <Login />,
					},
					{
						path: "/signup",
						element: <Signup />,
					},
				],
			},
			{
				path: "/room",
				element: <AuthCheckRev>
				<Room />
			</AuthCheckRev>,
			},
			{
				path: "/room/:gameid",
				element:<AuthCheckRev>
				<Game />
			</AuthCheckRev>,
			},
			{
				path: "/about_us",
				element: <About />,
			},
			{
				path: "/profile",
				element: <AuthCheckRev>
				<>profile</>
			</AuthCheckRev>, // Corrected rendering for profile
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);
