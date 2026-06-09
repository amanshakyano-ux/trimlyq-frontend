import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
 const storedUser = localStorage.getItem("user");
const user = storedUser && storedUser !== "undefined"
  ? JSON.parse(storedUser)
  : null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          TrimlyQ
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-slate-700 hover:text-emerald-600">
            Home
          </Link>

          {!token && (
            <>
              <Link to="/login" className="text-slate-700 hover:text-emerald-600">
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Signup
              </Link>
            </>
          )}

          {token && user && (
            <>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-emerald-600 capitalize">{user.role}</p>
              </div>

              {user.role === "owner" ? (
                <Link
                  to="/owner/dashboard"
                  className="text-slate-700 hover:text-emerald-600"
                >
                  Owner Dashboard
                </Link>
              ) : (
                <Link
                  to="/my-bookings"
                  className="text-slate-700 hover:text-emerald-600"
                >
                  My Bookings
                </Link>
              )}

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}