import { useState } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email.toLowerCase(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-full max-w-2xl bg-[#18181b] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-amber-600 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
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

            <div className="flex items-center mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-yellow-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-amber-700 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
