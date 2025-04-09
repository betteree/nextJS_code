"use client";

import styles from "@/styles/coachBoard.module.css";
import { useState, useEffect } from "react";

export default function CoachInfo() {
  const [coachData, setCoachData] = useState([]);
  const [contest, setContest] = useState<string | null>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setContest(localStorage.getItem("selectedCompetition"));
    }

    const coachId = localStorage.getItem("userId");
    fetch(`/api/database/coach?coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data) => {
        setCoachData(data.data);
      })
      .catch((err) => {
        console.error("Error fetching coach:", err);
      });
  }, []);

  return (
    <div className={styles.coachInfoContainer}>
      <h2>지도자 정보</h2>

      <dl>
        <span>
          <dt>이름 </dt>
          <dd>{coachData.name}</dd>
        </span>

        <span>
          <dt>소속</dt>
          <dd>{coachData.affiliation}</dd>
        </span>

        <span>
          <dt>연락처</dt>
          <dd>{coachData.phone}</dd>
        </span>
      </dl>

      <span>
        <dt>참여대회</dt>
        <dd>{contest}</dd>
      </span>
    </div>
  );
}
