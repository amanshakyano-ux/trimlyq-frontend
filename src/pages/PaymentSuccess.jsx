import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [message, setMessage] = useState("Verifying Payment...");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const res = await axiosInstance.post(
        `/payment/verify/${orderId}`
      );

      setMessage(res.data.message);
       setTimeout(() => {
      navigate("/my-bookings");
    }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Payment verification failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-emerald-600">
          {message}
        </h1>
      </div>
    </div>
  );
}