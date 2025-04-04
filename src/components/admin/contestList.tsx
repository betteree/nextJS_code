"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";
import Register from "@/components/admin/register";

export default function ContestList() {
  const [admins, setAdmins] = useState([]);
  const [table, setTable] = useState("competition");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/database?table=${table}`)
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error fetching admins:", err));
  }, []);

  const handleModal = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div className={styles.container}>
      <section className={styles.contestDetail}>
        <h3>대회 LIST</h3>
        <button onClick={handleModal}>대회 추가</button>
      </section>

      <table className={styles.contestTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>대회명</th>
            <th>대회날짜</th>
            <th>장소</th>
            <th>주관</th>
            <th>성별</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.location}</td>
              <td>{item.organizer}</td>
              <td>{item.gender}</td>
              <td>
                <button>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOpen && <Register isClose={handleModal}></Register>}
    </div>
  );
}
