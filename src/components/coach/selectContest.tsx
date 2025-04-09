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

  const handleSubmit = async () => {
    localStorage.setItem("selectedCompetition", selectedContest);
    router.push("/coach_board");
  };

  return (
    <div>
      <select
        name="contest"
        id="contest"
        defaultValue=""
        onChange={handleSelect}
      >
        <option value="">대회선택</option>
        {competition.map((item, index) => (
          <option value={item.title} key={index}>
            {item.title}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>다음</button>
    </div>
  );
}
