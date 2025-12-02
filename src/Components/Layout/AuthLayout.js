import React from "react";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import NavbarTop from "./Navbar/NavbarTop";

const AuthLayout = () => {
  return (
    <>
      <Topbar />
      <NavbarTop />
      <Outlet />
    </>
  );
};

export default AuthLayout;
