"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coach, Contest } from "@/types/result";
import { getClassdata } from "../data/classData";

export default function Sequence() {
  const [contestData, setContestData] = useState<Contest[]>([]); // Contest[]로 타입 지정
  const router = useRouter();

  // 대회받아오는 역할
  useEffect(() => {
    fetch("/api/database/sequence")
      .then((res) => res.json())
      .then((data) => {
        setContestData(data);
      });
  }, []);

  // 정보를 저장한 후 그에 해당하는 순서 결과 페이지로 이동
  const handleInfo = ({
    contest,
    coach,
  }: {
    contest: Contest;
    coach: Coach;
  }) => {
    localStorage.setItem("coach", coach.coach_competition_id);
    localStorage.setItem("competitionId", contest.id);
    localStorage.setItem("selectedCompetition", contest.title);
    localStorage.setItem("userId", coach.coach_id);
    // 페이지 이동
    router.push("/result_page");
  };

  // 대회에 해당하는 모든 것 가져오는 것
  const handleSend = async (competitionId: string) => {
    try {
      const res = await fetch(
        `/api/database/sequence/result?competition_id=${competitionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "전송 실패");
      }

      getClassdata(data, competitionId);
    } catch (err) {
      console.error(err);
      alert("전송 중 오류가 발생했어요!");
    }
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
                  <td rowSpan={contest.coaches.length}>
                    {contest.title}
                    <button onClick={() => handleSend(contest.id)}>전송</button>
                  </td>
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
