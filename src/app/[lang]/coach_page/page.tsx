"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Approve from "@/components/coach/approve";
import SelectContest from "@/components/coach/selectContest";
import { getDictionary } from "@/components/dictionaries/dictionaries";
import { use } from 'react';
import NavBar from "@/components/public/navBar";
export default function CoachPage({ params }: { params: Promise<{ lang: string }> }) {
  
  const { lang } = use(params);
  const dict = getDictionary(lang as 'ko' | 'en');

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
      
      {token ? 
      <>
      <NavBar dict={dict} type={dict.coach}/>
      <SelectContest lang={lang} dict={dict}/>
      </>
       : <Approve dict={dict} />}
    </Box>
  );
}
