'use client';

import { ReactNode, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/utils/createEmotionCache';
import theme from './theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [emotionCache] = useState(() => createEmotionCache());

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
