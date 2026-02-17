import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}


export default Home;
