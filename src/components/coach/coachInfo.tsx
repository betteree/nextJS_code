"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Coach } from "@/types/player";

export default function CoachInfo({dict}:{dict:Record<string, string>}) {
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
        {dict.coachInfo}
      </Typography>

      {coachData ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <InfoItem label={dict.name} value={coachData.name} />
            <InfoItem label={dict.affiliation} value={coachData.affiliation} />
            <InfoItem label={dict.contact} value={coachData.phone} />
          </Box>
          <Divider />
          <Box mt={2}>
            <InfoItem label={dict.participationContest} value={contest || "Not Select Contest"} />
          </Box>
        </>
      ) : (
        <Typography color="text.secondary">{dict.noCoachInfo}</Typography>
      )}
    </Paper>
  );
}


function InfoItem({ label, value }: {label:string,value:string}) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}
