"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function Approve({dict}:{dict: Record<string, string>}) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const schoolList = [
    "북부초등학교",
    "남부초등학교",
    "대구체육고등학교",
    "제주삼다수",
    "한국체육대학교",
    "공주대학교",
  ];

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      name,
      phone,
      affiliation,
    };

    const response = await fetch("/api/database/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.id);
      alert("로그인 되었습니다");
      window.location.reload();
    } else {
      console.error(result);
      alert(result.message);
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
        {dict.coach}
      </Typography>

      <Paper elevation={3} sx={{ p: 4, width: "70%", maxWidth: 500 }}>
        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label={dict.name}
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              label={dict.contact}
              variant="standard"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <FormControl variant="standard" required>
              <InputLabel id="affiliation-label">{dict.affiliation}</InputLabel>
              <Select
                labelId="affiliation-label"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
              >
                <MenuItem value="">
                  <em>{dict.select}</em>
                </MenuItem>
                {schoolList.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
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
