"use client";

import { useState ,use} from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getDictionary } from "@/components/dictionaries/dictionaries";

export default function AdminLogin({ params }: { params: Promise<{ lang: string }> }) {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { lang } = use(params);
  const dict = getDictionary(lang as 'ko' | 'en');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 예: 비밀번호가 "admin123"일 때 로그인 성공 처리
    if (password === "admin123") {
      // 로그인 상태 저장 (예: localStorage)
      localStorage.setItem("isAdmin", "true");
      // 관리자 페이지로 이동
      router.push(`/${lang}/admin_page`);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ pt: 10 }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome, admin!
      </Typography>

      <Typography variant="body1" align="center" sx={{ fontSize: '15px', marginBottom: '40px' }}>
        please enter your information to register <br />
        gymnast event orders.
      </Typography>

      <Paper elevation={3} sx={{ p: 4, width: "80%", maxWidth: 500, bgcolor: 'transparent', boxShadow: 0 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label={dict.password}
              variant="outlined"
              required
              sx={{ bgcolor: 'white' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />

            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2, background: "linear-gradient(90deg, #0200BA 0%, #6103B0 100%)" }}
              fullWidth
            >
            {dict.login}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
