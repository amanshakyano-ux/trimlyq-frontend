import { Routes, Route } from "react-router-dom";
import SalonDetails from "../pages/SalonDetails";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import PaymentSuccess from "../pages/PaymentSuccess";
import MyBookings from "../pages/MyBookings";
import OwnerDashboard from "../pages/owner/OwnerDashboard"
import CreateSalon from "../pages/owner/CreateSalon";
import CreateService from "../pages/owner/CreateService";
import EditSalon from "../pages/owner/EditSalon";
import EditService from "../pages/owner/EditService";
 
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/salon/:salonId" element={<SalonDetails />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/create-salon" element={<CreateSalon />} />
      <Route path="/owner/salon/:salonId/create-service" element={<CreateService />}/>
      <Route path="/owner/salon/:salonId/edit" element={<EditSalon/>}/>
       <Route path="/owner/service/:serviceId/edit" element={<EditService/>}/>
       </Routes>
    
    
  );
}