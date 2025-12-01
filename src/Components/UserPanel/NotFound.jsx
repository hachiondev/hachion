import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,follow";
    document.head.appendChild(meta);

    const timer = setTimeout(() => navigate("/", { replace: true }), 5000);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(meta);
    };
  }, [navigate]);

  return (
    <div style={{
      position:"fixed", inset:0, background:"#fff",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999
    }}>
      <div style={{ textAlign:"center", maxWidth:560, padding:"24px" }}>
        <h2 style={{ marginTop:0 }}>Invalid URL</h2>
        <p>The page <code>{pathname}</code> is no longer available. Please check the correct URL.</p>
        <p>Redirecting to the home page…</p>
      </div>
    </div>
  );
}
