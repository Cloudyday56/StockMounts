import React from "react";
import Input from "../components/Input";
import { LoaderIcon, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //redirect user after signup

  const backendUrl = import.meta.env.MODE === "production"
    ? "https://backend-6z9h.onrender.com"
    : "";

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email.toLowerCase(), password, name);
      console.log("Sign up clicked", { email, password, name });
      navigate("/"); //redirect to home page after successful signup
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-full max-w-2xl bg-[#18181b] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6 w-full">
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-yellow-500 hover:to-amber-600 transition"
            >
              Home
            </Link>
            <h2 className="text-3xl font-bold text-center flex-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-transparent bg-clip-text">
              Create Account
            </h2>
            <div className="w-24" />
          </div>

          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}
            <div className="mb-4">
              <PasswordStrengthMeter password={password} />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-amber-700 transition duration-200 text-lg disabled:opacity-50"
              disabled={isLoading || !email || !password || !name}
            >
              {isLoading ? (
                "Signing Up..."
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="flex flex-col items-center w-full">
            <p className="text-sm text-gray-400 text-center my-2 w-full">OR</p>
            <button
              className="w-1/2 max-w-md py-3 px-4 bg-gradient-to-r from-gray-300 to-gray-700 text-black font-bold rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-800 transition duration-200 text-lg"
              type="button"
              onClick={() =>
                (window.location.href = `${backendUrl}/api/auth/github`)
              }
            >
              Sign Up with GitHub
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to={"/login"} className="text-yellow-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
