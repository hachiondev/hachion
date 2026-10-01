"use client";

import { createContext, useContext } from "react";
import { useParams } from "next/navigation";
import { useCourses } from "@/Api/hooks/HomePageApi/NavbarApi/useCourses";
import { findCourseNameForSlug, toApiCourseName } from "./courseRouteUtils";

// Carries the server-resolved course name (lib/courseApiName.js) down to
// every client section of a course-scoped route so they all query the
// backend with the same, exact name - and the same react-query keys the
// server-seeded initialData was stored under.
const CourseApiNameContext = createContext("");

export function CourseApiNameProvider({ value, children }) {
  return <CourseApiNameContext.Provider value={value || ""}>{children}</CourseApiNameContext.Provider>;
}

// Falls back to the slug-derived guess when rendered outside a provider.
export function useCourseApiName() {
  const resolved = useContext(CourseApiNameContext);
  const { courseName: slug } = useParams() || {};
  if (resolved) return resolved;
  return slug ? toApiCourseName(slug) : "";
}

// For client components rendered outside the course route's provider (e.g.
// the layout's Footer): resolves the slug against the same lightweight
// names list (shared react-query cache with the navbar/enrollment form).
// Returns null until the list has loaded so callers don't fire a first
// request with a guessed name.
export function useCourseNameForSlug(slug) {
  const resolved = useContext(CourseApiNameContext);
  const { data: courses, isError, isSuccess } = useCourses({ enabled: !!slug && !resolved });
  if (!slug) return null;
  if (resolved) return resolved;
  if (isSuccess) return findCourseNameForSlug(courses, slug) || toApiCourseName(slug);
  if (isError) return toApiCourseName(slug);
  return null;
}
