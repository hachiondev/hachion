import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://api.hachion.co";

export function useUserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (/^https?:\/\//i.test(img)) return img;
    return `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  const getCookie = (name) => {
    const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
    const match = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const stored = localStorage.getItem("loginuserData");
    const avatarCookie = getCookie("avatar");

    if (stored) {
      try {
        const u = JSON.parse(stored);

        if (!u.picture && avatarCookie) {
          u.picture = avatarCookie;
          localStorage.setItem("loginuserData", JSON.stringify(u));
        }

        setUserData(u);
        setIsLoggedIn(true);
        return;
      } catch {}
    }

    // Story begins: ask backend
    fetch(`${API_BASE}/api/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((u) => {
        if (!u) return;

        const toStore = {
          name: u.name || "",
          email: u.email || "",
          picture: u.picture || avatarCookie || "",
        };

        localStorage.setItem("loginuserData", JSON.stringify(toStore));
        setUserData(toStore);
        setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/logout`, { method: "POST", credentials: "include" });
    } catch {}

    localStorage.clear();
    document.cookie = "avatar=; Max-Age=0; Path=/";

    setIsLoggedIn(false);
    setUserData(null);
  };

  return { userData, isLoggedIn, logout, resolveImageUrl };
}
