"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Approve from "@/components/coach/approve";
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
    <Box
      sx={{
        backgroundColor: "#f0f4f8",
        height: "150vh",
        position: "relative",
      }}
    >
      {token ? <SelectContest /> : <Approve />}
    </Box>
  );
}
