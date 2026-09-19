'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// Deliberately separate from src/app/providers.js (the admin Providers) so the
// public site and the admin panel each own an independent QueryClient/MUI
// cache instance - a change to one can't accidentally affect the other.
//
// No HelmetProvider here: every public page manages <head>/SEO tags via
// Next.js's native Metadata API (generateMetadata()), not react-helmet-async
// — that library's only real consumer (components/common/NoIndex.jsx) is
// admin-only and sits under its own separate HelmetProvider in
// src/app/providers.js. Wrapping the whole public tree in a provider with
// zero actual consumers was pure unused overhead on every public page.
export default function PublicProviders({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppRouterCacheProvider options={{ key: 'public-css' }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
}
