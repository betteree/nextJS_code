import styles from "@/styles/coachBoard.module.css";
import Approve from "@/components/coach/approve";

import CoachPlayer from "@/components/coach/coachPlayer";

export default function Contest() {
  return (
    <div className={styles.container}>
      <nav>
        <h2>지도자</h2>
      </nav>
      <CoachPlayer></CoachPlayer>
    </div>
  );
}
