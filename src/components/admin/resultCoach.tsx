"use client";

import styles from "@/styles/result.module.css";
import { useState, useEffect } from "react";
import { Coach } from "@/types/player";

export default function ResultCoach() {
  const [coachData, setCoachData] = useState<Coach>({
    affiliation: "",
    name: "",
    phone: "",
  });
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
        localStorage.setItem("division", data.data.affiliation);
      })
      .catch((err) => {
        console.error("Error fetching coach:", err);
      });
  }, []);

  return (
    <div className={styles.resultCoachConatainer}>
      <table className={styles.coachTable}>
        <tbody>
          <tr>
            <th>소속명</th>
            <td>
              {coachData.affiliation}/{contest}
            </td>
          </tr>
          <tr>
            <th>감독명</th>
            <td>
              {coachData.name} / 전화 : {coachData.phone}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
