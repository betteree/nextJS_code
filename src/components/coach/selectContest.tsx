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

  const handleSelect = (e) => {
    setSelectedContest(e.target.value); // ✅ 선택한 competition_id 저장
  };

  const handleSubmit = (contestTitle: string) => {
    localStorage.setItem("selectedCompetition", contestTitle);
    router.push("/coach_board");
  };

  return (
    <div>
      <ul>
        {competition.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleSubmit(item.title)}>
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
