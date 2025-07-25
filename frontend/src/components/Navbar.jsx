import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { TrendingUp } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-3xl font-bold text-primary font-mono tracking-tight"
          >
            StockMounts <TrendingUp size={32} strokeWidth={2.5} />
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
              <Link to="/create" className="btn btn-primary">
                + New Note
              </Link>
              <Link to="/profile" className="flex items-center">
                <img
                  src={user?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary hover:scale-105 transition-all"
                />
              </Link>
              </>
            )}
            {/* Auth buttons */}
            {isAuthenticated ? (
              <button className="btn btn-outline btn-error" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-outline btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
