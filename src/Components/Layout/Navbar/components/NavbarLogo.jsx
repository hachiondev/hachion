// src/Components/Navbar/components/NavbarLogo.jsx
import React from "react";
import logo from "../../../../Assets/logo.webp"

export default function NavbarLogo() {
  return (
    <a className="navbar-brand d-flex align-items-center" href="/">
      <img src={logo} alt="logo" className="logo" />
    </a>
  );
}
