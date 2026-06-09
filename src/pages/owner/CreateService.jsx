import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function CreateService() {
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationMinutes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axiosInstance.post("/admin/service/create", {
        salonId,
        name: formData.name,
        price: formData.price,
        durationMinutes: formData.durationMinutes,
      });

      setMessage(res.data.message || "Service created successfully");

      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <h1 className="text-4xl font-bold text-emerald-600 text-center">
        Create Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
      >
        <label className="block mb-2 font-medium">Service Name</label>
        <input
          type="text"
          name="name"
          placeholder="Hair Cut, Beard Trim, Facial..."
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Price</label>
        <input
          type="number"
          name="price"
          placeholder="Example: 199"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Duration Minutes</label>
        <input
          type="number"
          name="durationMinutes"
          placeholder="Example: 30"
          value={formData.durationMinutes}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        {message && (
          <p className="mb-4 text-emerald-600 font-medium">{message}</p>
        )}

        {error && (
          <p className="mb-4 text-red-600 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg ${
            loading
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700"
          }`}
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
}