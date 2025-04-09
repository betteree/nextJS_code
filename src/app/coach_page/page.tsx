"use client";

import styles from "@/styles/coachBoard.module.css";
import Approve from "@/components/coach/approve";
import { useEffect, useState } from "react";
import SelectContest from "@/components/coach/selectContest";

export default function CoachPage() {
  const [token, setToken] = useState<boolean | null>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      {token ? <SelectContest></SelectContest> : <Approve></Approve>}
    </div>
  );
}
