import styles from "@/styles/board.module.css";

export const metadata = {
  title: "About us",
};

export default function AboutUs() {
  const navList = [
    { name: "정보" },
    { name: "참가선수" },
    { name: "참가됨 종목" },
    { name: "경기순번" },
  ];

  return (
    <div className={styles.container}>
      <section className="topBar">
        <h3>대회명</h3>
        <h1>2025년 체조 대회</h1>
      </section>

      <div className={styles.gameInfo}>
        <section>
          <h3>개최장소</h3>
          <h2>대구체육고등학교</h2>
        </section>
        <section>
          <h3>개최일자</h3>
          <h2>20250111 ~ 20250112</h2>
        </section>
      </div>

      <nav className={styles.menu}>
        {navList.map((item) => (
          <button key={item.name}>{item.name}</button>
        ))}
      </nav>
    </div>
  );
}
