import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [bookingsBySalon, setBookingsBySalon] = useState({});
  const [deletePopup, setDeletePopup] = useState(false);
const [selectedSalonId, setSelectedSalonId] = useState(null);
const [deleting, setDeleting] = useState(false);
const [serviceDeletePopup, setServiceDeletePopup] = useState(false);
const [selectedServiceId, setSelectedServiceId] = useState(null);
const [serviceDeleting, setServiceDeleting] = useState(false);

 const fetchMySalons = async () => {
  try {
    const res = await axiosInstance.get("/admin/my-salons");

    const ownerSalons = res.data.salons || [];
    setSalons(ownerSalons);

    ownerSalons.forEach((salon) => {
      fetchSalonBookings(salon.id);
    });
  } catch (err) {
    console.log("Owner Dashboard Error:", err.response?.data || err.message);
  }
};
const fetchSalonBookings = async (salonId) => {
  try {
    const res = await axiosInstance.get(`/admin/salon/${salonId}`);

    console.log("Salon Id:", salonId);
    console.log("Bookings Response:", res.data.bookings);

    setBookingsBySalon((prev) => ({
      ...prev,
      [salonId]: res.data.bookings || [],
    }));
  } catch (err) {
    console.log("Fetch Bookings Error:", err.response?.data || err.message);
  }
};
const openDeletePopup = (salonId) => {
    setSelectedSalonId(salonId);
    setDeletePopup(true);
  };
const deleteSalon = async () => {
  try {
    setDeleting(true);

    await axiosInstance.delete(`/admin/salon/${selectedSalonId}`);

    setDeletePopup(false);
    setSelectedSalonId(null);
    fetchMySalons();
  } catch (err) {
    console.log("Delete Salon Error:", err.response?.data || err.message);
  } finally {
    setDeleting(false);
  }
};
const openServiceDeletePopup = (serviceId) => {
  setSelectedServiceId(serviceId);
  setServiceDeletePopup(true);
};
const deleteService = async () => {
  try {
    setServiceDeleting(true);

    await axiosInstance.delete(`/admin/service/${selectedServiceId}`);

    setServiceDeletePopup(false);
    setSelectedServiceId(null);
    fetchMySalons();
  } catch (err) {
    console.log("Delete Service Error:", err.response?.data || err.message);
  } finally {
    setServiceDeleting(false);
  }
};
const completeBooking = async (bookingId, salonId) => {
  try {
    await axiosInstance.patch(`/admin/booking/complete/${bookingId}`);

    fetchSalonBookings(salonId);
  } catch (err) {
    console.log("Complete Booking Error:", err.response?.data || err.message);
  }
};
  useEffect(() => {
    fetchMySalons();
  }, []);

 return (
  <div className="min-h-screen bg-slate-100 px-6 py-8">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-emerald-600">
            Owner Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your salons, services and bookings.
          </p>
        </div>

        <button
          onClick={() => navigate("/owner/create-salon")}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-emerald-700"
        >
          Create Salon
        </button>
      </div>

      {/* Salon Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {salons.map((salon) => (
          <div
            key={salon.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200"
          >
            <img
              src={salon.imageUrl}
              alt={salon.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold text-slate-900">
                {salon.name}
              </h2>

              <p className="mt-1 text-slate-500">
                {salon.area}, {salon.city}
              </p>
              <div className="mt-4 border-t border-slate-200 pt-4">
  <h3 className="font-semibold text-slate-800">
    Services
  </h3>

  {salon.Services && salon.Services.length > 0 ? (
    <div className="mt-3 space-y-2">
      {salon.Services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
        >
          <div>
            <p className="font-medium text-slate-800">
              {service.name}
            </p>
            <p className="text-sm text-slate-500">
              ₹{service.price} • {service.durationMinutes} min
            </p>
          </div>
          <div className="flex gap-2">
            
         <button
  onClick={() =>
    navigate(`/owner/service/${service.id}/edit`, {
      state: { service },
    })
  }
  className="text-sm border border-slate-300 text-slate-700 px-3 py-1 rounded-md cursor-pointer hover:bg-slate-100"
>
  Edit
</button>

 <button
  onClick={() => openServiceDeletePopup(service.id)}
  className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded-md cursor-pointer hover:bg-red-50"
>
  Delete
</button>

</div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-2 text-sm text-slate-500">
      No services added yet.
    </p>
  )}
</div>
 {/* Bookings block */}
<div className="mt-4 border-t border-slate-200 pt-4">
  <h3 className="font-semibold text-slate-800">
    Bookings
  </h3>

  {bookingsBySalon[salon.id] && bookingsBySalon[salon.id].length > 0 ? (
    <div className="mt-3 space-y-2">
      {bookingsBySalon[salon.id].map((booking) => (
        <div
          key={booking.id}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-slate-800">
                {booking.User?.name}
              </p>

              <p className="text-sm text-slate-500">
                {booking.Service?.name} • {booking.bookingDate} • {booking.slotTime}
              </p>
            </div>

           <div className="flex flex-col items-end gap-2">
  <span
    className={`text-xs px-2 py-1 rounded-full font-semibold ${
      booking.status === "completed"
        ? "bg-blue-100 text-blue-700"
        : booking.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-emerald-100 text-emerald-700"
    }`}
  >
    {booking.status === "completed"
      ? "Completed"
      : booking.status === "cancelled"
      ? "Cancelled"
      : "Booked"}
  </span>

  {booking.status === "booked" && (
    <button
      onClick={() => completeBooking(booking.id, salon.id)}
      className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-emerald-700"
    >
      Mark Complete
    </button>
  )}
</div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-2 text-sm text-slate-500">
      No bookings yet.
    </p>
  )}
</div>

{/* Buttons block */}
<div className="mt-5 grid grid-cols-2 gap-3">
  <button
    onClick={() => navigate(`/owner/salon/${salon.id}/create-service`)}
    className="bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700"
  >
    Add Service
  </button>

  <button
    onClick={() => navigate(`/owner/salon/${salon.id}/edit`)}
    className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100"
  >
    Edit Salon
  </button>

  <button
    onClick={() => openDeletePopup(salon.id)}
    className="col-span-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-50"
  >
    Delete Salon
  </button>
</div>
               
            </div>
          </div>
        ))}
      </div>

      {salons.length === 0 && (
        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">No salon created yet.</p>
        </div>
      )}
      {deletePopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-slate-900">
        Delete Salon?
      </h2>

      <p className="mt-3 text-slate-600">
        Are you sure you want to delete this salon? This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setDeletePopup(false);
            setSelectedSalonId(null);
          }}
          disabled={deleting}
          className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={deleteSalon}
          disabled={deleting}
          className={`px-4 py-2 rounded-lg text-white ${
            deleting
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 cursor-pointer hover:bg-red-700"
          }`}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
{serviceDeletePopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-slate-900">
        Delete Service?
      </h2>

      <p className="mt-3 text-slate-600">
        Are you sure you want to delete this service? This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setServiceDeletePopup(false);
            setSelectedServiceId(null);
          }}
          disabled={serviceDeleting}
          className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={deleteService}
          disabled={serviceDeleting}
          className={`px-4 py-2 rounded-lg text-white ${
            serviceDeleting
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 cursor-pointer hover:bg-red-700"
          }`}
        >
          {serviceDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  </div>
);
}