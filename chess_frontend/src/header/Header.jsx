import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import auth from "../appwrite/auth";
import { logout } from "../store/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginStatus = useSelector((state) => state.auth.status);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navbar = [
    { pageName: "Home", active: true, toLink: "/" },
    { pageName: "Room", active: loginStatus, toLink: "/room" },
    { pageName: "About us", active: true, toLink: "/about_us" },
  ];

  return (
    <header className="w-full bg-gray-950 shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <h1
          className="text-lg font-bold text-cyan-100 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Chess
        </h1>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex space-x-8">
          {navbar.map(
            (nav, i) =>
              nav.active && (
                <li key={i}>
                  <NavLink
                    to={loginStatus || nav.pageName === "About us" ? nav.toLink : "/login"}
                    className={({ isActive }) =>
                      isActive ? "text-cyan-300" : "text-gray-300 hover:text-white"
                    }
                  >
                    {nav.pageName}
                  </NavLink>
                </li>
              )
          )}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex space-x-2">
          {loginStatus ? (
            <>
              <button
                className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="px-3 py-2 text-sm border border-gray-300 text-gray-300 hover:bg-gray-700 rounded"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button
                className="px-3 py-2 text-sm border border-gray-300 text-gray-300 hover:bg-gray-700 rounded"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-900 px-4 pb-4 space-y-2">
          {navbar.map(
            (nav, i) =>
              nav.active && (
                <NavLink
                  key={i}
                  to={loginStatus || nav.pageName === "About us" ? nav.toLink : "/login"}
                  className="block text-gray-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {nav.pageName}
                </NavLink>
              )
          )}

          <hr className="border-gray-700" />

          {loginStatus ? (
            <>
              <button
                className="block w-full text-left text-gray-300"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="block w-full text-left text-gray-300"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                className="block w-full text-left text-gray-300"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button
                className="block w-full text-left text-gray-300"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
