import styles from "@/styles/contest.module.css";

export default function Contest() {
  return (
    <div className={styles.container}>
      <section className="topBar">
        <h3>대회명</h3>
        <h1>2025년 체조 대회</h1>
      </section>

      <div>
        <section className={styles.chooseGame}>
          <h3>경기선택</h3>
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index}>
              <input type="radio" name="game" id={`game${index}`} />
              <label htmlFor={`game${index}`}>{index + 1}경기</label>
            </span>
          ))}
        </section>

        <section>
          <h3>간격</h3>
          <select name="gap" id="gap">
            <option value="5">5초</option>
            <option value="10">10초</option>
          </select>
        </section>
      </div>
    </div>
  );
}
