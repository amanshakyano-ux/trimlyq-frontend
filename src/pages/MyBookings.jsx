import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/booking/my-bookings");
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.log("Bookings Error:", err.response?.data || err.message);
    }
  };
  const cancelBooking = async (bookingId) => {
  try {
    await axiosInstance.patch(`/booking/cancel/${bookingId}`);

    fetchBookings();
  } catch (err) {
    console.log("Cancel Booking Error:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    fetchBookings();
    
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <h1 className="text-4xl font-bold text-emerald-600">
  My Bookings
</h1>

<p className="mt-2 text-slate-600">
  View and manage your salon appointments.
</p>

      <div className="mt-6 grid gap-4">
        {bookings.map((booking) => (
         <div key={booking.id} className="bg-white p-4 rounded-xl shadow">
  <p>
    <strong>Date:</strong> {booking.bookingDate}
  </p>

  <p>
    <strong>Time:</strong> {booking.slotTime}
  </p>

  <div className="mt-3 flex items-center gap-3">
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        booking.status === "booked"
          ? "bg-emerald-100 text-emerald-700"
          : booking.status === "cancelled"
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {booking.status}
    </span>

    {booking.status === "booked" && (
      <button
        onClick={() => cancelBooking(booking.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-red-600"
      >
        Cancel
      </button>
    )}
  </div>
</div>
        ))}
      </div>
    </div>
  );
}