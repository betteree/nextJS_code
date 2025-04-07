import styles from "@/styles/coachBoard.module.css";

export default function CoachInfo() {
  return (
    <div className={styles.coachInfoContainer}>
      <h2>지도자 정보</h2>
      <dl>
        <span>
          <dt>이름 </dt>
          <dd>홍길동</dd>
        </span>

        <span>
          <dt>소속</dt>
          <dd>남부초등학교</dd>
        </span>

        <span>
          <dt>연락처</dt>
          <dd>010-1234-5678</dd>
        </span>
      </dl>

      <span>
        <dt>참여대회</dt>
        <dd>전국 체육고등학교 대회</dd>
      </span>
    </div>
  );
}
