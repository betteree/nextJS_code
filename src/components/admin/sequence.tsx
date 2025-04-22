"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Sequence() {
  const [contestData, setContestData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/database/sequence")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setContestData(data);
      });
  }, []);

  const handleInfo = ({ contest, coach }) => {
    localStorage.setItem("coach", coach.coach_competition_id);
    localStorage.setItem("competitionId", contest.id);
    localStorage.setItem("selectedCompetition", contest.title);
    localStorage.setItem("userId", coach.coach_id);
    // 페이지 이동
    router.push("/result_page");
  };
  return (
    <div className={styles.container}>
      <section className={styles.contestDetail}>
        <h3>선수 순서 LIST</h3>
      </section>

      <table className={styles.contestTable}>
        <thead>
          <tr>
            <th>대회명</th>
            <th>#</th>
            <th>지도자</th>
            <th>학교명</th>
            <th>전화번호</th>
            <th>순서</th>
          </tr>
        </thead>
        <tbody>
          {contestData.map((contest, contestIndex) =>
            contest.coaches.map((coach, coachIndex) => (
              <tr key={`${contestIndex}-${coachIndex}`}>
                {coachIndex === 0 && (
                  <td rowSpan={contest.coaches.length}>{contest.title}</td>
                )}
                <td>{coachIndex + 1}</td>
                <td>{coach.name}</td>
                <td>{coach.affiliation}</td>
                <td>{coach.phone}</td>
                <td>
                  <button onClick={() => handleInfo({ contest, coach })}>
                    보기
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
