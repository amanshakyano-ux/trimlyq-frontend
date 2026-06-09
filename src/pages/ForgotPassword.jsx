import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/password/forgot-password", {
        email,
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-4 border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {message && (
          <p className="mt-4 text-emerald-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}