import styles from "@/styles/coachBoard.module.css";
import Approve from "@/components/coach/approve";

export default function CoachPage() {
  return (
    <div className={styles.container}>
      <Approve></Approve>
    </div>
  );
}
