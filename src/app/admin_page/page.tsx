import styles from "@/styles/adminBoard.module.css";

export default function AdminPage() {
  const gymnasticsTournaments = [
    "전국체조선수권대회",
    "전국소년체육대회",
    "전국체육대회",
    "대통령배체조대회",
    "문화체육관광부장관기체조대회",
    "전국학생체조대회",
    "코리아컵체조대회",
    "춘계체조대회",
    "추계체조대회",
    "협회장배체조대회",
  ];

  return (
    <div className={styles.container}>
      <h2>관리자</h2>
      <div className={styles.header}>
        <section>
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
            <label htmlFor="host">주관</label>
            <select name="host" id="host">
              <option value="0">기관선택</option>
              <option value="0">대한체육협회</option>
              <option value="1">체육연맹</option>
            </select>
          </span>
          <span className={styles.gender}>
            <label htmlFor="male">남자</label>
            <input type="radio" id="male" name="gender" />
            <label htmlFor="female">여자</label>
            <input type="radio" id="female" name="gender" />
          </span>
          <button>등록</button>
        </section>

        <section className={styles.contestList}>
          <h3>대회 목록</h3>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>대회명</th>
              </tr>
            </thead>
            <tbody>
              {gymnasticsTournaments.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className={styles.contestDetail}>
        <h3>대회 상세</h3>
      </section>
    </div>
  );
}
