import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

   const handleSignup = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const res = await axiosInstance.post("/user/signup", formData);

    setMessage(res.data.message || "Signup successful. Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Signup failed");
    setLoading(false);
  }
};
  

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow"
      >
        <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-slate-500">
          Signup to book salon appointments.
        </p>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="mt-6 w-full border p-3 rounded-lg"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mt-4 w-full border p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="mt-4 w-full border p-3 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />

        <select
          name="role"
          className="mt-4 w-full border p-3 rounded-lg"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="owner">Salon Owner</option>
        </select>

        {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
        {message && (
          <p className="mt-4 text-emerald-600 font-medium">{message}</p>
        )}

      <button
  type="submit"
  disabled={loading}
  className={`mt-6 w-full py-3 rounded-lg text-white ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
  }`}
>
  {loading ? "Signing up..." : "Signup"}
</button>
      </form>
    </div>
  );
}