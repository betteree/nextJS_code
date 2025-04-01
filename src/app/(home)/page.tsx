import styles from "../../styles/home.module.css";
import Link from "next/link";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <h2>설정</h2>
        <span>
          <label htmlFor="socket">소켓</label>
          <input
            type="text"
            id="socket"
            placeholder="http://192.168.0.136:3001"
          />
        </span>
        <span>
          <label htmlFor="">언어</label>
          <select name="lang" id="lang">
            <option value="Korea">한국어</option>
            <option value="English">영어</option>
          </select>
        </span>
        <span>
          <label htmlFor="type">타입</label>
          <select name="type" id="type">
            <option value="admin">관리자</option>
            <option value="judge">심판</option>
          </select>
        </span>
        <span>
          <label htmlFor="">채널</label>
          <select name="channel" id="channel">
            <option value="admin">[00]</option>
            <option value="judge">[01]</option>
          </select>
        </span>

        <button className={styles.reset}>설정 초기화</button>
        <button className={styles.apply}>
          <Link href="/admin_board">적용</Link>
        </button>
      </div>
    </>
  );
}
