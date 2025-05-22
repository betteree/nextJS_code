"use client";

import { useRouter } from "next/navigation";
import { Box, Button, AppBar, Toolbar, Typography } from "@mui/material";
import CoachInfo from "@/components/coach/coachInfo";
import CoachPlayer from "@/components/coach/coachPlayer";
import { use } from 'react';
import { getDictionary } from "@/components/dictionaries/dictionaries";

export default function Contest({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();

  const { lang } = use(params);
  const dict = getDictionary(lang as 'ko' | 'en');


  const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f0f4f8",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <AppBar position="static"  sx={{
    background: 'linear-gradient(90deg, #0200BA 0%, #6103B0 100%)'}}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight={500}>{dict.coach}</Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ fontWeight: "bold" ,bgcolor:"#fff", color:"#6003B0", borderRadius:"0"}}
          >
            {dict.logout}
          </Button>
        </Toolbar>
      </AppBar>

     <Box
       sx={{
        display: "flex",
        flexDirection: "column",
       alignItems: "center",
        gap: 4, 
        width: "100%",
        mt: 5, 
        mb:5,
      }}
  >
  <Box
    sx={{
      backgroundColor: "white",
      boxShadow: 1,
      borderRadius: 1,
      width: "80%",
      p: 3,
    }}
  >
    <CoachInfo dict={dict} />
  </Box>

  <Box
    sx={{
      backgroundColor: "white",
      boxShadow: 2,
      borderRadius: 2,
      width: "80%",
      p: 3,
    }}
  >
    <CoachPlayer lang={lang} dict={dict} />
  </Box>
</Box>
    </Box>
  );
}
