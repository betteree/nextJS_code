"use client";

import { useRouter } from "next/navigation";
import { Box, Button, AppBar, Toolbar, Typography } from "@mui/material";
import CoachInfo from "@/components/coach/coachInfo";
import CoachPlayer from "@/components/coach/coachPlayer";

export default function Contest() {
  const router = useRouter();

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
          <Typography variant="h6">지도자</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: "bold" }}
          >
            로그아웃
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
        <CoachInfo />
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
        <CoachPlayer />
      </Box>
    </Box>
  );
}
