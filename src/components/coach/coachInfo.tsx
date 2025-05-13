"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Coach } from "@/types/player";

export default function CoachInfo() {
  const [coachData, setCoachData] = useState<Coach | null>(null);
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
    <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        지도자 정보
      </Typography>

      {coachData ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <InfoItem label="이름" value={coachData.name} />
            <InfoItem label="소속" value={coachData.affiliation} />
            <InfoItem label="연락처" value={coachData.phone} />
          </Box>
          <Divider />
          <Box mt={2}>
            <InfoItem label="참여대회" value={contest || "선택된 대회 없음"} />
          </Box>
        </>
      ) : (
        <Typography color="text.secondary">지도자 정보가 없습니다.</Typography>
      )}
    </Paper>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}
