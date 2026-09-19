'use client';

import dynamic from "next/dynamic";

const CategoryTable = dynamic(() => import("@/components/AdminPanel/CategoryTable"), {
    loading: () => null,
    ssr: false,
});

export default function Page() {
    return <CategoryTable />;
}
