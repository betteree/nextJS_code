"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Contest } from "@/types/player";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Paper,
} from "@mui/material";

export default function SelectContest() {
  const [competition, setCompetition] = useState<Contest[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/database/admin?table=competition`)
      .then((res) => res.json())
      .then((data) => {
        setCompetition(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "100px 10%",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={2}>
        대회 선택
      </Typography>

      <motion.div initial="hidden" animate="visible" variants={listVariants}>
        <Paper
          elevation={3}
          sx={{
            border: "2px solid dodgerblue",
            borderRadius: "5px",
            backgroundColor: "white",
            padding: "20px",
            width: "100%",
          }}
        >
          <List disablePadding>
            {competition.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ListItem disableGutters sx={{ mb: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSubmit(item)}
                    sx={{
                      borderColor: "dodgerblue",
                      backgroundColor: "#f0f8ff",
                      color: "black",
                      ":hover": {
                        backgroundColor: "dodgerblue",
                        color: "white",
                      },
                      fontSize: "16px",
                      borderRadius: "5px",
                      paddingBlock: "5px",
                    }}
                  >
                    {item.title}
                  </Button>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Paper>
      </motion.div>
    </Box>
  );
}
