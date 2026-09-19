'use client';

import dynamic from "next/dynamic";

const Reports = dynamic(() => import("@/components/AdminPanel/Reports"), {
    loading: () => null,
    ssr: false,
});

export default function Page() {
    return <Reports />;
}
