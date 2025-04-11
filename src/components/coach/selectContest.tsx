"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SelectContest() {
  const [competition, setCompetition] = useState([]);
  const [selectedContest, setSelectedContest] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/database/admin?table=${"competition"}`)
      .then((res) => res.json())
      .then((data) => {
        setCompetition(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = async (contest) => {
    localStorage.setItem("selectedCompetition", contest.title);
    localStorage.setItem("competitionId", contest.id);
    const coachId = localStorage.getItem("userId");

    const competitionData = {
      coach_id: coachId,
      competition_id: contest.id,
    };

    const competitionResponse = await fetch("/api/database/coach_competition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(competitionData),
    });

    const result = await competitionResponse.json();
    if (result.success) {
      router.push("/coach_board");
    } else {
      alert(`실패 ${result.error}`);
    }
  };

  return (
    <div>
      <ul>
        {competition.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleSubmit(item)}>{item.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
