"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import "./Home.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

const PopupBanner = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupBanner, setPopupBanner] = useState(null);
  const router = useRouter();
  const popupRef = useRef();

  // Deferred: don't fetch or show this on first paint — it competes with
  // the actual page content for network/main-thread time during the part
  // of the load that Core Web Vitals (LCP/TBT) actually measure. Trigger on
  // whichever comes first: a short delay, or the visitor starting to scroll
  // (both signal the page is already interactive).
  useEffect(() => {
    const alreadyShown = localStorage.getItem("popupShown");
    if (alreadyShown) return;
    const fetchPopupBanner = async () => {
      try {
        const response = await axios.get(`https://api.hachion.co/banner`);
        const enabledPopup = response.data.find(banner => banner.status === "Enabled" && banner.banner_image);
        if (enabledPopup) {
          // Mounts the overlay (still hidden — see the `popupBanner` effect
          // below and the `is-open` class in Home.css) before marking it
          // shown, so the reveal is a pure opacity/visibility transition on
          // already-present DOM rather than a fresh insertion.
          setPopupBanner(enabledPopup);
          localStorage.setItem("popupShown", "true");
        }
      } catch (error) {
        console.error("Error fetching popup banner:", error);
      }
    };
    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      fetchPopupBanner();
    };
    const timer = setTimeout(trigger, 4000);
    window.addEventListener("scroll", trigger, {
      once: true,
      passive: true
    });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", trigger);
    };
  }, []);
  // Reveals the (already-mounted, still-invisible) overlay one frame after
  // its content mounts, so the reveal itself only ever toggles opacity/
  // visibility — never inserts new DOM — keeping it exempt from CLS.
  useEffect(() => {
    if (!popupBanner) return;
    const raf = requestAnimationFrame(() => setShowPopup(true));
    return () => cancelAnimationFrame(raf);
  }, [popupBanner]);

  const handleClose = () => setShowPopup(false);
  const handleExploreMore = () => router.push("/courses");

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);
  // Always mounted (never `return null`) once a banner is available, and
  // toggled via the `is-open` class (opacity/visibility only, see
  // Home.css) instead of conditional mounting — measured via Lighthouse:
  // mounting this fixed, full-viewport overlay fresh into the DOM (the
  // previous `if (!showPopup) return null` pattern) registered as a real
  // layout shift (the page's entire CLS score) even though nothing else on
  // the page visibly moved, because Chrome's Layout Instability API only
  // exempts shifts caused solely by compositor-only property changes
  // (opacity/transform), not brand-new element insertion. Staying mounted
  // and animating opacity/visibility keeps this fix CLS-exempt by
  // construction rather than by chance timing.
  if (!popupBanner) return null;
  return <div className={`popup-overlay${showPopup ? " is-open" : ""}`} aria-hidden={!showPopup}>
      <div className="popup-container" ref={popupRef}>
        <button className="close-popup" onClick={handleClose} tabIndex={showPopup ? 0 : -1}>
          <RiCloseCircleLine size={24} />
        </button>
        <a href="/courses" tabIndex={showPopup ? 0 : -1}>
          {/* next/image (not a plain <img>) so the arbitrary admin-uploaded
              original (documented as up to 800x500 but often shipped
              unoptimized straight from the CMS) is resized/re-encoded on
              the fly instead of downloaded at full source resolution —
              this single image was measured via Lighthouse at ~2MB of
              avoidable transfer. */}
          <Image
            src={`https://api.hachion.co/uploads/prod/banner_images/${popupBanner.banner_image}`}
            alt="Popup Banner"
            className="popup-image"
            width={800}
            height={500}
            sizes="(max-width: 800px) 92vw, 800px"
          />
        </a>
        <div className="button-center">
          <button className="join-now" onClick={handleExploreMore} tabIndex={showPopup ? 0 : -1}>
            Explore More
          </button>
        </div>
      </div>
    </div>;
};
export default PopupBanner;
