"use client"

import "./global.css";
import { Toaster } from "react-hot-toast";
import ThemeRegistry from "@/theme/ThemeRegistry"// ThemeRegistry 추가
import { useEffect } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    return () => document.removeEventListener("gesturestart", handler);
  }, []);
  
  return (
    <html lang="ko-KR">
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <ThemeRegistry>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeRegistry>
      </body>
    </html>
  );
}
