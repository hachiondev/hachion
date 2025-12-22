// src/Components/Navbar/hooks/useSearch.js
import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Fuse from "fuse.js";

export function useSearch(courses = [], blogs = []) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const location = useLocation();

  const courseFuse = useMemo(() => {
    if (!courses || courses.length === 0) return null;
    return new Fuse(courses, { keys: ["courseName"], threshold: 0.4 });
  }, [courses]);

  const blogFuse = useMemo(() => {
    if (!blogs || blogs.length === 0) return null;
    return new Fuse(blogs, { keys: ["title"], threshold: 0.45 });
  }, [blogs]);

  const onChange = useCallback(
    (e) => {
      const q = e.target.value;
      setQuery(q);

      if (!q || q.trim().length < 2) {
        setResults([]);
        return;
      }

      const items = [];
      if (courseFuse)
        items.push(
          ...courseFuse
            .search(q)
            .slice(0, 6)
            .map((r) => ({ ...r.item, type: "course" }))
        );

      if (blogFuse)
        items.push(
          ...blogFuse
            .search(q)
            .slice(0, 6)
            .map((r) => ({ ...r.item, type: "blog" }))
        );

      setResults(items);
    },
    [courseFuse, blogFuse]
  );

  // ✅ CLEAR SEARCH ON ROUTE CHANGE
  useEffect(() => {
    setQuery("");
    setResults([]);
  }, [location.pathname]);

  return { query, results, onChange, setResults, setQuery };
}
