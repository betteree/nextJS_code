"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Contest } from "@/types/player";
import { motion } from "framer-motion";
import styles from "@/styles/coachBoard.module.css";

export default function SelectContest() {
  const [competition, setCompetition] = useState<Contest[]>([]);
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

  // 원하는 대회의 버튼을 누르면 그 데이터가 전송되도록 함
  const handleSubmit = async (contest: Contest) => {
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
      localStorage.setItem("coach", result.coachCompetitionId);
      router.push("/coach_board");
    } else {
      alert(`실패 ${result.error}`);
    }
  };

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // 아이템 하나씩 0.2초 간격으로 등장
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className={styles.selectContainer}>
      <h2>대회 선택</h2>
      <motion.ul initial="hidden" animate="visible" variants={listVariants}>
        {competition.map((item, index) => (
          <motion.li key={index} variants={itemVariants}>
            <button onClick={() => handleSubmit(item)}>{item.title}</button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
