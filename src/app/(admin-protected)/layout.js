import Providers from '@/app/providers';

// Auth is enforced by middleware (src/middleware.js) before this layout
// ever renders, so an unauthenticated request never reaches this code or
// downloads the protected bundle. This stays a Server Component; Providers
// itself is the client boundary.
export default function AdminProtectedLayout({ children }) {
  return <Providers>{children}</Providers>;
}
