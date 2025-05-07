"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coach, Contest } from "@/types/result";
import { getClassdata } from "../data/classData";
import { RotateLoader } from "react-spinners";

export default function Sequence() {
  const [contestData, setContestData] = useState<Contest[]>([]); // Contest[]로 타입 지정
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // 검색 필터 변수
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 필터링
  const filteredData = contestData
    .map((contest) => {
      // 해당 대회에서 검색어가 포함된 지도자만 추출
      const filteredCoaches = contest.coaches.filter((coach) =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // 만약 필터된 지도자가 있다면 그 대회를 결과에 포함
      if (filteredCoaches.length > 0) {
        return {
          ...contest,
          coaches: filteredCoaches, // 필터된 지도자들만 남김
        };
      }
      return null;
    })
    .filter((contest) => contest !== null);

  // 대회받아오는 역할
  useEffect(() => {
    setLoading(true);
    fetch("/api/database/sequence")
      .then((res) => res.json())
      .then((data) => {
        setContestData(data);
        setLoading(false);
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
      <section className={styles.sequenceDetail}>
        <h3>선수 순서 LIST</h3>
        <input
          type="text"
          placeholder="지도자,대회,학교 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
      ) : contestData.length === 0 ? (
        <p>등록된 대회가 없습니다.</p>
      ) : (
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
            {filteredData.map((contest, contestIndex) =>
              contest.coaches.map((coach, coachIndex) => (
                <tr key={`${contestIndex}-${coachIndex}`}>
                  {coachIndex === 0 && (
                    <td rowSpan={contest.coaches.length}>
                      {contest.title}
                      <button onClick={() => handleSend(contest.id)}>
                        전송
                      </button>
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
      )}
    </div>
  );
}
