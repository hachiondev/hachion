'use client';

import dynamic from "next/dynamic";

const CourseSchedule = dynamic(() => import("@/components/AdminPanel/CourseSchedule"), {
    loading: () => null,
    ssr: false,
});

export default function Page() {
    return <CourseSchedule />;
}
