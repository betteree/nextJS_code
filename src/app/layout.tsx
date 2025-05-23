import "../styles/global.css";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ThemeRegistry from "@/theme/ThemeRegistry"// ThemeRegistry 추가

export const metadata: Metadata = {
  title: {
    template: "%s | page",
    default: "Next page",
  },
  description: "next practice",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-KR">
      <body>
        <ThemeRegistry>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeRegistry>
      </body>
    </html>
  );
}
