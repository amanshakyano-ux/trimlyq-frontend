import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
export default function CreateSalon() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    area: "",
    openingTime: "",
    closingTime: "",
  });
const navigate = useNavigate();
  const [salonImage, setSalonImage] = useState(null);
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

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const data = new FormData();

    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("area", formData.area);
    data.append("openingTime", formData.openingTime);
    data.append("closingTime", formData.closingTime);
    data.append("salonImage", salonImage);

    await axiosInstance.post("/admin/salon/create", data);

    setMessage("Salon created successfully. Redirecting...");

    setTimeout(() => {
      navigate("/owner/dashboard");
    }, 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to create salon");
    setLoading(false);
  }
};
  return (
  <div className="min-h-screen bg-slate-100 px-6 py-8">
    <h1 className="text-4xl font-bold text-emerald-600 text-center">
      Create Salon
    </h1>

    <form
      onSubmit={handleSubmit}
      className="mt-8 bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
    >
      <input
        type="text"
        name="name"
        placeholder="Salon Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="text"
        name="area"
        placeholder="Area"
        value={formData.area}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg mb-4"
      />
<label className="block mb-2 font-medium">
  Opening Time
</label>
      <input
        type="time"
        name="openingTime"
        value={formData.openingTime}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="time"
        name="closingTime"
        value={formData.closingTime}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="file"
        onChange={(e) => setSalonImage(e.target.files[0])}
        className="w-full border p-3 rounded-lg mb-4"
      />
{message && (
  <p className="mb-4 text-emerald-600 font-medium">
    {message}
  </p>
)}

{error && (
  <p className="mb-4 text-red-600 font-medium">
    {error}
  </p>
)}
      <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-lg cursor-pointer ${
    loading
      ? "bg-slate-400 text-white cursor-not-allowed"
      : "bg-emerald-600 text-white hover:bg-emerald-700"
  }`}
>
  {loading ? "Creating Salon..." : "Create Salon"}
</button>
    </form>
  </div>
  )
};