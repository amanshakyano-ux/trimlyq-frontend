import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";


export default function Login() {
  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const res = await axiosInstance.post("/user/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);

    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    

    window.location.href = "/"
  } catch (err) {
    setError(
      err.response?.data?.message || "Login failed. Please try again."
    );

    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow"
      >
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-slate-500">Login to book your salon slot.</p>

        <input
          type="email"
          placeholder="Email"
          className="mt-6 w-full border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
{
  error && (
    <p className="mt-4 text-red-600 font-medium">
      {error}
    </p>
  )
}
       <button
  type="submit"
  disabled={loading}
  className={`mt-6 w-full py-3 rounded-lg text-white ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
  }`}
>
  {loading ? "Logging in..." : "Login"}
</button>
        <div className="mt-4 text-right">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-emerald-600 hover:underline cursor-pointer"
  >
    Forgot Password?
  </button>
</div>
      </form>
    </div>
  );
}