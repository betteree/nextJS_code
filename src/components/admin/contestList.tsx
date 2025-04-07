"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";
import Register from "@/components/admin/register";
import { register } from "module";

export default function ContestList() {
  const [admins, setAdmins] = useState([]);
  const [table, setTable] = useState("competition");
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetch(`/api/database?table=${table}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data);
      })
      .catch((err) => console.error("Error fetching admins:", err));
  }, []);

  const handleModal = (type: string) => {
    setIsOpen((isOpen) => !isOpen);
    setModalType(type);
  };

  const changeDate = (date: string) => {
    const NewDate = new Date(date);
    return NewDate.toLocaleDateString("ko-KR");
  };
  return (
    <div className={styles.container}>
      <section className={styles.contestDetail}>
        <h3>대회 LIST</h3>
        <button onClick={() => handleModal("register")}>대회 추가</button>
      </section>

      <table className={styles.contestTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>대회명</th>
            <th>대회시작</th>
            <th>대회종료</th>
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
              <td>{changeDate(item.start_date)}</td>
              <td>{changeDate(item.end_date)}</td>
              <td>{item.location}</td>
              <td>{item.organizer}</td>
              <td>{item.gender}</td>
              <td>
                <button onClick={() => handleModal("modify")}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOpen && (
        <Register modalType={modalType} isClose={handleModal}></Register>
      )}
    </div>
  );
}
