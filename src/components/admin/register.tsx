import styles from "@/styles/adminBoard.module.css";

export default function Register({ isClose }) {
  return (
    <div className={styles.Modal}>
      <section className={styles.registerContainer}>
        <button onClick={isClose} className={styles.close}>
          닫기
        </button>
        <span>
          <label htmlFor="title">대회명</label>
          <input type="text" name="title" />
        </span>
        <span>
          <label htmlFor="startday">시작 날짜</label>
          <input type="date" name="startday" id="startday" />
        </span>
        <span>
          <label htmlFor="endday">종료 날짜</label>
          <input type="date" name="endday" id="endday" />
        </span>
        <span>
          <label htmlFor="place">장소</label>
          <input type="text" name="place" />
        </span>
        <span>
          <label htmlFor="host">주관</label>
          <select name="host" id="host">
            <option value="0">기관선택</option>
            <option value="0">대한체육협회</option>
            <option value="1">체육연맹</option>
          </select>
        </span>
        <span className={styles.gender}>
          <label htmlFor="male">남자</label>
          <input type="checkbox" id="male" name="gender" />
          <label htmlFor="female">여자</label>
          <input type="checkbox" id="female" name="gender" />
        </span>
        <button>등록</button>
      </section>
    </div>
  );
}
