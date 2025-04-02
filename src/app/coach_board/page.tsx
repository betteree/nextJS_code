import styles from "@/styles/coachBoard.module.css";
import Approve from "@/components/approve";

import CoachPlayer from "@/components/coachPlayer";
export default function Contest() {
  return (
    <div className={styles.container}>
      <CoachPlayer></CoachPlayer>
    </div>
  );
}
