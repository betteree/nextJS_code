import styles from "@/styles/coachBoard.module.css";
import Approve from "@/components/coach/approve";
import CoachInfo from "@/components/coach/coachInfo";
import CoachPlayer from "@/components/coach/coachPlayer";

export default function Contest() {
  return (
    <div className={styles.container}>
      <nav>
        <h2>지도자</h2>
        <CoachInfo></CoachInfo>
      </nav>
      <main>
        <CoachPlayer></CoachPlayer>
      </main>
    </div>
  );
}
