'use client';

import dynamic from "next/dynamic";

const CorporateCourses = dynamic(() => import("@/components/AdminPanel/CorporateCourses"), {
    loading: () => null,
    ssr: false,
});

export default function Page() {
    return <CorporateCourses />;
}
