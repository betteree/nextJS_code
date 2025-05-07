"use client";

import styles from "@/styles/coachBoard.module.css";
import CoachInfo from "@/components/coach/coachInfo";
import CoachPlayer from "@/components/coach/coachPlayer";
import { useRouter } from "next/navigation";

export default function Contest() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <nav>
        <header>
          <h2>지도자</h2>
          <button onClick={handleLogout}>로그아웃</button>
        </header>

        <CoachInfo></CoachInfo>
      </nav>
      <main>
        <CoachPlayer></CoachPlayer>
      </main>
    </div>
  );
}
