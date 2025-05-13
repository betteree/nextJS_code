"use client";

import { useState } from "react";
import ContestList from "@/components/admin/contestList";
import Sequence from "@/components/admin/sequence";
import { Box, Typography, Button } from "@mui/material";

export default function AdminPage() {
  const [adminList, setAdminList] = useState("contest");

  const handleNav = (list: string) => {
    setAdminList(list);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Navigation Bar */}
      <Box
        component="nav"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          borderBottom: "2px solid lightgray",
        }}
      >
        <Typography variant="h4" fontWeight={400}>
          관리자
        </Typography>

        <Box component="ul" sx={{ display: "flex", gap: 2, listStyle: "none", m: 0, p: 0 }}>
          <li>
            <Button
              onClick={() => handleNav("contest")}
              sx={{
                fontSize: 16,
                borderBottom: adminList === "contest" ? "2px solid dodgerblue" : "none",
                color: adminList === "contest" ? "dodgerblue" : "inherit",
                backgroundColor: "transparent",
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              대회 LIST
            </Button>
          </li>

          {/* 요청 LIST (주석 처리됨) */}
          {/* <li>
            <Button
              onClick={() => handleNav("request")}
              sx={{
                fontSize: 16,
                borderBottom: adminList === "request" ? "2px solid dodgerblue" : "none",
                color: adminList === "request" ? "dodgerblue" : "inherit",
              }}
            >
              요청 LIST
            </Button>
          </li> */}

          <li>
            <Button
              onClick={() => handleNav("sequence")}
              sx={{
                fontSize: 16,
                borderBottom: adminList === "sequence" ? "2px solid dodgerblue" : "none",
                color: adminList === "sequence" ? "dodgerblue" : "inherit",
                backgroundColor: "transparent",
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              선수 순서
            </Button>
          </li>
        </Box>
      </Box>

      {/* Content Section */}
      {adminList === "contest" ? <ContestList /> : <Sequence />}
    </Box>
  );
}

