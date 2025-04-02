import styles from "@/styles/adminBoard.module.css";

export default function AboutUs() {
  return (
    <div className={styles.container}>
      <h2>관리자</h2>
      <span>
        <label htmlFor="title">대회명</label>
        <input type="text" name="title" />
      </span>
      <span>
        <label htmlFor="date">대회날짜</label>
        <input type="date" name="startday" />
      </span>
      <span>
        <label htmlFor="place">장소</label>
        <input type="text" name="place" />
      </span>
      <span>
        <label htmlFor="male">남자</label>
        <input type="radio" id="male" name="gender" />
        <label htmlFor="female">여자</label>
        <input type="radio" id="female" name="gender" />
      </span>
    </div>
  );
}
