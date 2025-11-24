import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const loginUserData = localStorage.getItem("loginuserData");

  return loginUserData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;