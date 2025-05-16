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
        height: "150vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#476ff3" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{dict.coach}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: "bold" }}
          >
            {dict.logout}
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 2,
          borderRadius: 2,
          position: "absolute",
          top: "100px",
          width: "80%",
         
        }}
      >
        <CoachInfo dict={dict}/>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 2,
          borderRadius: 2,
          position: "absolute",
          top: "500px",
          width: "80%",
          padding: 3,
        }}
      >
        <CoachPlayer dict={dict}/>
      </Box>
    </Box>
  );
}
