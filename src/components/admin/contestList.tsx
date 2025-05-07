"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";
import Register from "@/components/admin/register";
import { Admin } from "@/types/player";
import { RotateLoader } from "react-spinners";

export default function ContestList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [itemData, setItemData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/database/admin?table=${"competition"}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admins:", err);
        setLoading(false);
      });
  }, []);

  const handleModal = (item: Admin | null) => {
    setIsOpen((isOpen) => !isOpen);
    setItemData(item);
  };

  return (
    <div className={styles.container}>
      <section className={styles.contestDetail}>
        <h3>대회 LIST</h3>
        <button onClick={() => handleModal(null)}>대회 추가</button>
      </section>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <RotateLoader size={10} color="#1E90FF" />
        </div>
      ) : admins.length === 0 ? (
        <p>등록된 대회가 없습니다.</p>
      ) : (
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
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.location}</td>
                <td>{item.organizer}</td>
                <td>{item.gender}</td>
                <td>
                  <button onClick={() => handleModal(item)}>수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isOpen && (
        <Register itemData={itemData} isClose={handleModal}></Register>
      )}
    </div>
  );
}
