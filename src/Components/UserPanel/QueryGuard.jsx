
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QueryGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(5);

  
  const isInvalid = useMemo(() => {
    const params = new URLSearchParams(location.search);
    
    return location.pathname === "/" && params.has("product");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isInvalid) return;

    setShow(true);
    setLeft(5);

    
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,follow";
    document.head.appendChild(meta);

    const tick = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    const timer = setTimeout(() => navigate("/", { replace: true }), 5000);

    return () => {
      clearInterval(tick);
      clearTimeout(timer);
      document.head.removeChild(meta);
    };
  }, [isInvalid, navigate]);

  if (!show) return null;

  
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{ textAlign: "center", maxWidth: 560, padding: "24px" }}>
        <h2 style={{ marginTop: 0 }}>Invalid URL</h2>
        <p style={{ margin: "8px 0" }}>
          This URL is no longer valid. Please check the correct URL.
        </p>
        <p style={{ margin: "8px 0" }}>
          Redirecting to the home page in <b>{left}s</b>…
        </p>
      </div>
    </div>
  );
}
