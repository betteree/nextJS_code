"use client";
import { useState } from "react";
import styles from "@/styles/contest.module.css";

export default function Contest() {
  const [data, setData] = useState([
    {
      name: "남자대학부",
      details: [
        { age: 22, job: "마루", isChecked: false },
        { age: 25, job: "철봉", isChecked: false },
        { age: 25, job: "평행봉", isChecked: false },
        { age: 25, job: "도마", isChecked: false },
        { age: 25, job: "안마", isChecked: false },
      ],
    },
  ]);

  return (
    <div className={styles.container}>
      <section className="topBar">
        <h3>대회명</h3>
        <h1>2025년 체조 대회</h1>
      </section>

      <div className={styles.selectContainer}>
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

      <section className={styles.gameContainer}>
        <button>BACK</button>
        <table>
          <thead>
            <tr>
              <th>부</th>
              <th>
                <input type="checkbox" />
              </th>
              <th>종목코드</th>
              <th>종목</th>
            </tr>
          </thead>

          <tbody>
            {data.map((person, personIndex) => (
              <>
                {person.details.map((detail, index) => (
                  <tr key={detail}>
                    {index === 0 && (
                      <td rowSpan={person.details.length}>{person.name}</td>
                    )}
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{detail.age}</td>
                    <td>{detail.job}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
