import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true"; // ✅ Use sessionStorage

  return isLoggedIn ? <Outlet /> : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;