"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";

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
  const [clickContest, SetClickContest] = useState("");

  const [admins, setAdmins] = useState([]);
  const [table, setTable] = useState("competition");

  useEffect(() => {
    fetch(`/api/database?table=${table}`)
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error fetching admins:", err));
  }, []);
  const handleContest = (item: string) => SetClickContest(item);
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
                  <td onClick={() => handleContest(item)}>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className={styles.contestDetail}>
        <h3>대회 상세</h3>
      </section>

      <table>
        <thead>
          <tr>
            <th>대회명</th>
            <th>대회날짜</th>
            <th>장소</th>
            <th>주관</th>
            <th>성별</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.location}</td>
              <td>{item.organizer}</td>
              <td>{item.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
