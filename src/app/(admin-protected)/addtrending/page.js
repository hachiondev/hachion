'use client';

import dynamic from "next/dynamic";

const TrendingCourseTable = dynamic(() => import("@/components/AdminPanel/TrendingCourseTable"), {
    loading: () => null,
    ssr: false,
});

export default function Page() {
    return <TrendingCourseTable />;
}
