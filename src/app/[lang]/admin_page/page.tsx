"use client";

import { useState, useEffect } from "react";
import ContestList from "@/components/admin/contestList";
import Sequence from "@/components/admin/sequence";
import { Box, Button } from "@mui/material";
import React ,{ use }from 'react';
import { useRouter } from "next/navigation";
import { getDictionary } from "@/components/dictionaries/dictionaries";
import { ClipLoader } from "react-spinners";
import NavBar from "@/components/public/navBar";


export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
 const router = useRouter();
 const { lang } = use(params);
 const dict = getDictionary(lang as 'ko' | 'en');
  const [loading, setLoading] = useState(true);

  const [adminList, setAdminList] = useState("sequence");
   useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin");
    if (adminFlag !== "true") {
      alert("접근 권한이 없습니다");
      router.replace(`/${lang}/admin_login`);
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleNav = (list: string) => {
    setAdminList(list);
  };

    if (loading) {
    return <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <ClipLoader size={50} color="#36d7b7" />
    </div>;
  }
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
     <NavBar dict={dict} type={dict.admin}/>
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

