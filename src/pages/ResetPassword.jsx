import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const res = await axiosInstance.patch(`/password/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full mt-4 border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p className="mt-4 text-emerald-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}