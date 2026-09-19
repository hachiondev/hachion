import { NextResponse } from "next/server";

// Server-side proxy so the bearer token (SITEMAP_API_TOKEN, server-only
// env var) never reaches the browser bundle — the CRA original called
// this endpoint directly from the client with the token hardcoded in
// source, visible to anyone via view-source/devtools.
export async function GET() {
  try {
    const res = await fetch(`https://api.hachion.co/course-categories/all`, {
      headers: {
        Authorization: `Bearer ${process.env.SITEMAP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("sitemap-categories proxy failed", error);
    return NextResponse.json([], { status: 502 });
  }
}
