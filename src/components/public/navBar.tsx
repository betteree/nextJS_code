'use client';

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";



export default function NavBar({ dict,type }:{dict:Record<string, string>,type:string}) {

    const router = useRouter();
    const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

    return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #0200BA 0%, #6103B0 100%)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" fontWeight={500}>
          {type}
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            fontWeight: "bold",
            bgcolor: "#fff",
            color: "#6003B0",
            borderRadius: 0,
          }}
        >
          {dict.logout}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
