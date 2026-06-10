import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { load } from "@cashfreepayments/cashfree-js";

export default function SalonDetails() {
  const navigate = useNavigate();
  const { salonId } = useParams();

  const [salon, setSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingPopup, setBookingPopup] = useState(false);

  const fetchSalonDetails = async () => {
    try {
      const res = await axiosInstance.get(`/salon/${salonId}`);
      setSalon(res.data.salon);
    } catch (err) {
      console.log("Salon Details Error:", err.response?.data || err.message);
    }
  };

  const fetchSlots = async (date, serviceId) => {
    try {
      const res = await axiosInstance.get(
        `/booking/available-slots/${serviceId}?date=${date}`
      );

      setSlots(res.data.availableSlots || []);
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
      setPaymentLoading(true);

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
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonDetails();
  }, [salonId]);

  if (!salon) {
    return <h1 className="p-8 text-2xl">Loading...</h1>;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <img
        src={salon.imageUrl}
        alt={salon.name}
        className="w-full h-80 object-cover rounded-2xl"
      />

      <h1 className="mt-6 text-4xl font-bold">{salon.name}</h1>
      <p className="mt-2 text-slate-600">
        {salon.area}, {salon.city}
      </p>
      <p className="mt-2 text-slate-600">Owner: {salon.owner?.name}</p>
      <p className="mt-2 text-slate-600">
        Open: {salon.openingTime} - {salon.closingTime}
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Services</h2>

      <div className="mt-4 grid gap-4">
        {salon.services?.map((service) => (
          <div
            key={service.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-slate-500">
                {service.durationMinutes} mins
              </p>
            </div>

            <div className="text-right">
              <p className="text-emerald-600 font-bold">₹{service.price}</p>

              <button
                onClick={() => {
                  setSelectedService(service);
                  setBookingDate("");
                  setSlots([]);
                  setSelectedSlot("");
                  setPaymentLoading(false);
                  setBookingPopup(true);
                }}
                className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookingPopup && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => {
                setBookingPopup(false);
                setSelectedService(null);
                setBookingDate("");
                setSlots([]);
                setSelectedSlot("");
                setPaymentLoading(false);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-red-500 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-slate-900">
              Book {selectedService.name}
            </h2>

            <p className="mt-1 text-slate-500">
              ₹{selectedService.price} • {selectedService.durationMinutes} mins
            </p>

            <label className="block mt-5 text-sm font-medium text-slate-700">
              Choose Date
            </label>

            <input
              type="date"
              value={bookingDate}
              onChange={(e) => {
                const date = e.target.value;

                setBookingDate(date);
                setSelectedSlot("");
                fetchSlots(date, selectedService.id);
              }}
              className="mt-2 w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {bookingDate && (
              <>
                <h3 className="mt-5 font-semibold text-slate-800">
                  Choose Time Slot
                </h3>

                <div className="mt-3 flex flex-wrap gap-3">
                  {slots.length > 0 ? (
                    slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 border rounded-lg cursor-pointer ${
                          selectedSlot === slot
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-100 text-slate-800 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">
                      No slots available for this date.
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleCreateOrder}
              disabled={!bookingDate || !selectedSlot || paymentLoading}
              className={`mt-6 w-full py-3 rounded-lg text-white ${
                !bookingDate || !selectedSlot || paymentLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              }`}
            >
              {paymentLoading
                ? "Redirecting to payment..."
                : "Proceed to Payment"}
            </button>

            <button
              onClick={() => {
                setBookingPopup(false);
                setSelectedService(null);
                setBookingDate("");
                setSlots([]);
                setSelectedSlot("");
              }}
              disabled={paymentLoading}
              className="mt-3 w-full border border-slate-300 py-3 rounded-lg hover:bg-slate-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}