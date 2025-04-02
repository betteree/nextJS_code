import "../styles/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | page",
    default: "Next page",
  },
  description: "next practice",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
