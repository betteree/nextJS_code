"use client";

import styles from "@/styles/coachBoard.module.css";
import { useState, useEffect } from "react";

export default function CoachInfo() {
  const [table, setTable] = useState("coach");
  const [coachData, setCoachData] = useState([]);

  useEffect(() => {
    fetch(`/api/database/admin?table=${table}`)
      .then((res) => res.json())
      .then((data) => {
        setCoachData(data);
      })
      .catch((err) => {
        console.error("Error fetching coach:", err);
      });
  }, [table]);

  return (
    <div className={styles.coachInfoContainer}>
      <h2>지도자 정보</h2>
      <dl>
        <span>
          <dt>이름 </dt>
          <dd>홍길동</dd>
        </span>

        <span>
          <dt>소속</dt>
          <dd>남부초</dd>
        </span>

        <span>
          <dt>연락처</dt>
          <dd>010-1111-1111</dd>
        </span>
      </dl>

      <span>
        <dt>참여대회</dt>
        <dd>전국 체육고등학교 대회</dd>
      </span>
    </div>
  );
}
