import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (!success) {
      setError("Invalid email or password");
    } else {
      // redirect based on role
      switch (true) {
        case email.includes("farmer"):
          navigate("/farmer-dashboard");
          break;
        case email.includes("lab"):
          navigate("/lab-dashboard");
          break;
        case email.includes("agent"):
          navigate("/agent-dashboard");
          break;
        case email.includes("manufacturer"):
          navigate("/manufacturer-dashboard");
          break;
        case email.includes("admin"):
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/farmer-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-emerald-200">
      
      {/* Back / Navbar */}
      <div className="w-full bg-white/90 backdrop-blur-md shadow-md p-4 flex items-center max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-green-600 font-medium hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <div className="flex items-center ml-auto space-x-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <span className="font-bold text-xl">HerbTrace</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h1>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all text-lg font-semibold"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-green-600 font-medium cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
