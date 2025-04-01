import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div>
      <h1>페이지를 찾을 수 없습니다 😂</h1>
    </div>
  );
}
