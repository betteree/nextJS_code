'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/utils/createEmotionCache';
import theme from './theme';
import { Toaster } from 'react-hot-toast';

const clientSideEmotionCache = createEmotionCache();

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    return () => document.removeEventListener('gesturestart', handler);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </ThemeProvider>
    </CacheProvider>
  );
}
