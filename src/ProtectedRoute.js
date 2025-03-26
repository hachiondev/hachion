import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"; // Check if admin is logged in

  return isLoggedIn ? <Outlet /> : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;
