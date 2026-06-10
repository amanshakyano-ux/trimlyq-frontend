import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import SalonCard from "../components/SalonCard";

export default function Home() {
  const [salons, setSalons] = useState([]);
  const [query, setQuery] = useState("");

 const fetchSalons = async (searchQuery = "") => {
  try {
    const cleanQuery = searchQuery.trim();

    const res = await axiosInstance.get(
      `/salon/search?query=${encodeURIComponent(cleanQuery)}`
    );

    setSalons(res.data.salons || []);
  } catch (err) {
    console.log("Salon API Error:", err.response?.data || err.message);
  }
};
useEffect(() => {
  const timer = setTimeout(() => {
    fetchSalons(query);
  }, 500);

  return () => clearTimeout(timer);
}, [query]);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <h1 className="text-5xl font-bold text-slate-900">
        Book Your Next
        <span className="text-emerald-600"> Salon Visit</span>
      </h1>

      <p className="mt-4 text-lg text-slate-600">
        Discover top-rated salons, compare services, and book appointments instantly.
      </p>

      <div className="mt-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by salon, city, area..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchSalons(query);
            }
          }}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={() => fetchSalons(query)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 cursor-pointer"
        >
          Search
        </button>
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-slate-800">
        Popular Salons
      </h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {salons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>
    </div>
  );
}