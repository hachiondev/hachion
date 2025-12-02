import React, { useEffect, useState, useRef } from "react";
import Topbar from "./Topbar";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { Outlet, useLocation } from "react-router-dom";
import NavbarTop from "./Navbar/NavbarTop";

const Layout = () => {
  const [showStickyBar, setShowStickyBar] = useState(false);
  const footerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Show sticky bar after scrolling 200px
      if (scrollY > 200) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Run scroll handler on route change
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isFooterVisible = entries[0].isIntersecting;

        // If footer is visible → hide the sticky bar
        if (isFooterVisible) {
          setShowStickyBar(false);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="layout-wrapper">
      <Topbar />
      <NavbarTop />

      <main className="layout-content">
        <Outlet />
      </main>

      <div ref={footerRef}>
        <Footer />
      </div>

      {showStickyBar && <StickyBar />}
    </div>
  );
};

export default Layout;
