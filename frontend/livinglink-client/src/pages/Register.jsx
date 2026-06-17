import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ROOM_SEEKER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);
      setMessage(response);

      if (response === "User registered successfully") {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setMessage("Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Create Account</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            required
          />

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

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option value="ROOM_SEEKER">Room Seeker</option>
            <option value="LISTING_OWNER">Listing Owner</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded font-semibold"
          >
            Register
          </button>
        </form>

        {message && <p className="mt-4 text-center text-slate-300">{message}</p>}

        <p className="mt-4 text-center text-slate-400">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-400">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;