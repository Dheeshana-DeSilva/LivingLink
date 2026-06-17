import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { loginSuccess } from "../features/auth/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      dispatch(loginSuccess(response));

      setMessage("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage("Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded font-semibold"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-slate-300">{message}</p>}

        <p className="mt-4 text-center text-slate-400">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("/register")} className="text-blue-400">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;