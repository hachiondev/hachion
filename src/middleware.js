import { NextResponse } from 'next/server';
import { courseRedirects } from './lib/courseRedirects';
import { blogCategoryRedirects } from './lib/blogCategoryRedirects';

// Looked up as an exact string, not matched with the admin-auth block
// below - this must run (and return) for every /coursedetails/* request
// before the admin-auth check even sees it, since these are unrelated,
// unauthenticated legacy URLs.
function findCourseRedirectDestination(pathname) {
  if (courseRedirects[pathname]) return courseRedirects[pathname];
  // Next.js's request.nextUrl.pathname is not guaranteed to preserve
  // percent-encoding for non-ASCII byte sequences (e.g. the one old URL
  // containing %e2%80%93, an encoded en dash) the same way across Node
  // versions - the map is keyed on the literal encoded string from the
  // source CSV, so also try the decoded form before giving up.
  try {
    const decoded = decodeURIComponent(pathname);
    if (decoded !== pathname && courseRedirects[decoded]) return courseRedirects[decoded];
  } catch {
    // malformed percent-encoding - fall through to "no match"
  }
  return null;
}

// Handles two distinct legacy-URL problems under /blogs/, each resolved in
// a single 308/301 - never a chain:
//  1. Repeated/trailing slashes (e.g. ".../apache-kafka-architecture///////")
//     - Next's own router only strips ONE trailing slash per request, so an
//     old URL with several extra slashes would otherwise take several
//     redirects in a row to fully resolve.
//  2. Bare category-only URLs with no article segment (e.g. "/blogs/act")
//     - there's no category-index page, so these have always 404'd; see
//     blogCategoryRedirects.js for why /blogs?category=<slug> is the
//     correct, already-working destination.
// Normal /blogs/<category>/<title> requests - even with an old/garbled
// category or an old numeric id - are deliberately left untouched here:
// the dynamic route itself already looks the blog up by title/id alone and
// permanently redirects to the correct URL (verified live against
// production). Duplicating that logic here would create a second,
// possibly-conflicting source of truth for the same thing.
//
// A stray trailing "-" on the title segment is the one exception: unlike a
// garbled category or old id, fixing it doesn't need the blog's own data
// (a DB lookup) - it's a plain string transform, the same class of fix as
// the repeated-slash cleanup below - so it's handled here for a real 301
// instead of the dynamic route's framework-level 308 permanentRedirect.
// Root cause is a leading/trailing space in the admin's manually-entered
// "Short Blog URL" field (invisible in a text input, and not rejected by
// its letters-and-spaces-only validation) turning into a leading/trailing
// hyphen once getBlogPath() (src/lib/blogUrl.js) maps spaces to hyphens -
// see that function for the matching fix to canonical URLs/sitemap/internal
// links, which this cannot reach since it never calls the backend.
function findBlogRedirect(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'blogs') return null;

  if (segments.length === 2) {
    let categorySegment = segments[1];
    try {
      categorySegment = decodeURIComponent(categorySegment);
    } catch {
      // malformed percent-encoding - use the raw segment as-is
    }
    const category = blogCategoryRedirects[categorySegment.toLowerCase()];
    if (category) return { path: '/blogs', category };
  }

  if (segments.length === 3) {
    // A leading space in the same admin field produces a leading "-" the
    // same way a trailing space produces a trailing one - stripped
    // symmetrically here for the same reason.
    const trimmed = segments[2].replace(/^-+|-+$/g, '');
    // Guard against an all-hyphen segment stripping down to nothing.
    if (trimmed) segments[2] = trimmed;
  }

  const clean = '/' + segments.join('/');
  if (clean !== pathname) return { path: clean };

  return null;
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/coursedetails/')) {
    const destination = findCourseRedirectDestination(pathname);
    if (destination) {
      // Query params (e.g. utm_source) are preserved on the new URL rather
      // than dropped.
      return NextResponse.redirect(new URL(destination + search, request.url), 301);
    }
    return NextResponse.next();
  }

  // The matcher's "/blogs/:path*" also matches the bare "/blogs" list page
  // itself (no trailing slash) - startsWith('/blogs/') alone would miss
  // that and fall through to the admin-auth gate below, incorrectly
  // requiring admin login for the public blog list.
  if (pathname === '/blogs' || pathname.startsWith('/blogs/')) {
    const redirect = findBlogRedirect(pathname);
    if (redirect) {
      const url = new URL(redirect.path, request.url);
      url.search = search;
      if (redirect.category) url.searchParams.set('category', redirect.category);
      return NextResponse.redirect(url, 301);
    }
    return NextResponse.next();
  }

  const isLoggedIn = request.cookies.get('isAdminLoggedIn')?.value === 'true';

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/adminlogin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admindashboardview',
    '/admincourse',
    '/courseschedule',
    '/corporatecourses',
    '/addtrending',
    '/reports',
    '/coursedetails/:path*',
    '/blogs/:path*',
  ],
};
