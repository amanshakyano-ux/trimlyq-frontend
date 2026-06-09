import { useNavigate } from "react-router-dom";
export default function SalonCard({ salon }) {

     const navigate = useNavigate();
  return (
    <div
  onClick={() => navigate(`/salon/${salon.id}`)}
  className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
>
      <img
        src={salon.imageUrl}
        alt={salon.name}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h2 className="mt-3 text-xl font-semibold">
        {salon.name}
      </h2>

      <p className="text-slate-500">
        {salon.area}, {salon.city}
      </p>

      <p className="mt-2 font-medium text-emerald-600">
        From ₹{salon.servicesFrom}
      </p>
    </div>
  );
}