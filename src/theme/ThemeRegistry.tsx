// app/ThemeRegistry.tsx
"use client";

import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import createEmotionCache from "@/utils/createEmotionCache";
import createEmotionServer from "@emotion/server/create-instance";
import theme from "./theme";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  useServerInsertedHTML(() => {
    const emotionChunks = extractCriticalToChunks(
      // emotion에서 서버 렌더된 스타일 수집
      cache.sheet.toString()
    );
    return (
      <>
        <style
          data-emotion={`css ${emotionChunks.styles.map(style => style.key).join(" ")}`}
          dangerouslySetInnerHTML={{
            __html: emotionChunks.styles.map(style => style.css).join(""),
          }}
        />
      </>
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
