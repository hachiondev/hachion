'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          {children}
        </HelmetProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
}
