"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Coach } from "@/types/player";

export default function ResultCoach() {
  const [coachData, setCoachData] = useState<Coach>({
    affiliation: "",
    name: "",
    phone: "",
  });
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
        localStorage.setItem("division", data.data.affiliation);
      })
      .catch((err) => {
        console.error("Error fetching coach:", err);
      });
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <TableContainer component={Paper}>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{ border: "3px solid black", fontWeight: "bold", width: "120px" ,
                  padding:"10px",
                }}
              >
                소속명
              </TableCell>
              <TableCell sx={{ border: "3px solid black" ,
                fontSize: "18px" ,
                padding:"0",
                textAlign:"center",
              }}>{coachData.affiliation}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ border: "3px solid black", fontWeight: "bold", width: "120px" ,
                  padding:"10px"
                }}
              >
                대회명
              </TableCell>
              <TableCell sx={{ border: "3px solid black", 
                 fontSize: "18px" ,
                padding:"0",
                textAlign:"center",
                
              }}>{contest}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ border: "3px solid black", fontWeight: "bold", width: "120px",
                  padding:"10px"
                 }}
              >
                감독명
              </TableCell>
              <TableCell sx={{ border: "3px solid black" ,
                fontSize: "18px" ,
                padding:"0",
                textAlign:"center",
              }}>
                {coachData.name} / 전화 : {coachData.phone}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
