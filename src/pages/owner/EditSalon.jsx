import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function EditSalon() {
  const { salonId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    area: "",
    openingTime: "",
    closingTime: "",
  });

  const [salonImage, setSalonImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const fetchSalonDetails = async () => {
  try {
    const res = await axiosInstance.get(`/salon/${salonId}`);

    const salon = res.data.salon;

    setFormData({
      name: salon.name || "",
      address: salon.address || "",
      city: salon.city || "",
      area: salon.area || "",
      openingTime: salon.openingTime || "",
      closingTime: salon.closingTime || "",
    });
  } catch (err) {
    console.log("Fetch Salon Error:", err.response?.data || err.message);
  }
};
useEffect(() => {
  fetchSalonDetails();
}, []);
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
      const data = new FormData();

      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("area", formData.area);
      data.append("openingTime", formData.openingTime);
      data.append("closingTime", formData.closingTime);

      if (salonImage) {
        data.append("salonImage", salonImage);
      }

      const res = await axiosInstance.patch(`/admin/salon/${salonId}`, data);

      setMessage(res.data.message || "Salon updated successfully");

      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update salon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <h1 className="text-4xl font-bold text-emerald-600 text-center">
        Edit Salon
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
      >
        <label className="block mb-2 font-medium">Salon Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter salon name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">City</label>
        <input
          type="text"
          name="city"
          placeholder="Enter city"
          value={formData.city}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Area</label>
        <input
          type="text"
          name="area"
          placeholder="Enter area"
          value={formData.area}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Opening Time</label>
        <input
          type="time"
          name="openingTime"
          value={formData.openingTime}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Closing Time</label>
        <input
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2 font-medium">Salon Image</label>
        <input
          type="file"
          onChange={(e) => setSalonImage(e.target.files[0])}
          className="w-full border p-3 rounded-lg mb-4"
        />

        {message && (
          <p className="mb-4 text-emerald-600 font-medium">{message}</p>
        )}

        {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg ${
            loading
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700"
          }`}
        >
          {loading ? "Updating..." : "Update Salon"}
        </button>
      </form>
    </div>
  );
}