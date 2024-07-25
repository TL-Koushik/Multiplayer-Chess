import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./footer/Footer";
import Header from "./header/Header";

function Home() {
	return (
		<div className='h-screen w-screen flex flex-col bg-gray-900 text-white'>
			<Header />
			<Outlet />
			{/* <Footer /> */}
		</div>
	);
}

export default Home;
