"use client";

import { useState } from "react";
import ContestList from "@/components/admin/contestList";
import Sequence from "@/components/admin/sequence";
import { Box, Typography, Button } from "@mui/material";
import React ,{ use }from 'react';
import { useRouter } from "next/navigation";



export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
 const router = useRouter();

 const { lang } = use(params);

  const [adminList, setAdminList] = useState("contest");
  const handleNav = (list: string) => {
    setAdminList(list);
  };



  const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        component="nav"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
         background: 'linear-gradient(90deg, #0200BA 0%, #6103B0 100%)',
        }}
      >
        <Typography variant="h4" fontWeight={500} sx={{color:"white"}}>
          관리자
        </Typography>

        <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ fontWeight: "bold" ,bgcolor:"#fff", color:"#6003B0", borderRadius:"0"}}
          >
          LOGOUT
          </Button>
      </Box>
        <Box component="ul" sx={{ display: "flex",justifyContent:"end", gap: 2, listStyle: "none", mt: 8, pr: 10 ,borderBottom:"1px solid #CECECE" }}>
          <li>
            <Button
              onClick={() => handleNav("contest")}
              sx={{
                fontSize: 18,
                borderRadius:0,
                borderBottom: adminList === "contest" ? "2px solid #5602B1" : "none",
                color: adminList === "contest" ? "#5602B1" : "inherit",
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
                fontSize: 18,
                borderRadius:0,
                borderBottom: adminList === "sequence" ? "2px solid #5602B1" : "none",
                color: adminList === "sequence" ? "#5602B1" : "inherit",
                backgroundColor: "transparent",
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              선수 순서
            </Button>
          </li>
        </Box>

      {/* Content Section */}
      {adminList === "contest" ? <ContestList /> : <Sequence lang={lang}/>}
    </Box>
  );
}

