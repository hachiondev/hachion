import React, { useEffect , useState, useRef } from 'react';
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [showStickyBar, setShowStickyBar] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShowStickyBar(true);
          } else {
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
    <>
      <Topbar />
      <NavbarTop />

      <Outlet />

      <div ref={footerRef}>
        <Footer />
      </div>
      {showStickyBar && <StickyBar />}
    </>
  );
};

export default Layout;
