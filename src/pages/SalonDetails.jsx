import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
export default function SalonDetails() {
    const navigate = useNavigate();
  const { salonId } = useParams();
  const [salon, setSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
const [bookingDate, setBookingDate] = useState("");
const [slots, setSlots] = useState([]);
const [selectedSlot, setSelectedSlot] = useState("");
  const fetchSalonDetails = async () => {
    try {
      const res = await axiosInstance.get(`/salon/${salonId}`);
      setSalon(res.data.salon);
    } catch (err) {
      console.log("Salon Details Error:", err.response?.data || err.message);
    }
  };

  const fetchSlots = async (date) => {
  try {
    const res = await axiosInstance.get(
      `/booking/available-slots/${selectedService.id}?date=${date}`
    );

    setSlots(res.data.availableSlots);
  } catch (err) {
    console.log("Slots Error:", err.response?.data || err.message);
  }
};
const handleCreateOrder = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await axiosInstance.post("/payment/create-order", {
      serviceId: selectedService.id,
      bookingDate,
      slotTime: selectedSlot,
    });

    const cashfree = await load({
      mode: "sandbox",
    });

    await cashfree.checkout({
      paymentSessionId: res.data.paymentSessionId,
      redirectTarget: "_self",
    });
  } catch (err) {
    console.log("Payment Error:", err.response?.data || err.message);
  }
};
  useEffect(() => {
    fetchSalonDetails();
  }, [salonId]);

  if (!salon) return <h1 className="p-8 text-2xl">Loading...</h1>;

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <img src={salon.imageUrl} alt={salon.name} className="w-full h-80 object-cover rounded-2xl" />

      <h1 className="mt-6 text-4xl font-bold">{salon.name}</h1>
      <p className="mt-2 text-slate-600">{salon.area}, {salon.city}</p>
      <p className="mt-2 text-slate-600">Owner: {salon.owner?.name}</p>
      <p className="mt-2 text-slate-600">Open: {salon.openingTime} - {salon.closingTime}</p>

      <h2 className="mt-8 text-2xl font-semibold">Services</h2>

      <div className="mt-4 grid gap-4">
        {salon.services?.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-slate-500">{service.durationMinutes} mins</p>
            </div>

            <div className="text-right">
              <p className="text-emerald-600 font-bold">₹{service.price}</p>
               <button
  onClick={() => {
    setSelectedService(service);
    setBookingDate("");
    setSlots([]);
    setSelectedSlot("");
  }}
  className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer"
>
  Book Now
</button>
            </div>
          </div>
        ))}
      </div>
      {
  selectedService && (
    <div className="mt-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold">
        Booking: {selectedService.name}
      </h2>

 <input
  type="date"
  value={bookingDate}
  onChange={(e) => {
    setBookingDate(e.target.value);
    fetchSlots(e.target.value);
  }}
  className="mt-4 border p-3 rounded-lg"
/>
<div className="mt-4 flex flex-wrap gap-3">
  {slots.map((slot) => (
    <button
      key={slot}
      onClick={() => setSelectedSlot(slot)}
      className={`px-4 py-2 border rounded-lg cursor-pointer ${
        selectedSlot === slot
          ? "bg-emerald-600 text-white"
          : "bg-slate-100 hover:bg-emerald-600 hover:text-white"
      }`}
    >
      {slot}
    </button>
  ))}
</div>

 
{selectedSlot && (
  <button
  onClick={handleCreateOrder}
  className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-emerald-700"
>
  Continue to Payment
</button>
)}
    </div>
  )
}
    </div>
  );
}