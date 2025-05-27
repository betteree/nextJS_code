import "../styles/global.css";
import { Toaster } from "react-hot-toast";
import ThemeRegistry from "@/theme/ThemeRegistry"// ThemeRegistry 추가



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-KR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
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
