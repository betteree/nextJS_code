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

  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const countryList = [
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
      email,
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
      alert("Login successful");
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
        Welcome, {dict.coach}!
      </Typography>

     <Typography variant="body1" align="center" sx={{ fontSize: '15px' ,marginBottom:'40px'}}>
         please enter your information to register <br />
            gymnast event orders.
    </Typography>

      <Paper elevation={3} sx={{ p: 4, width: "80%", maxWidth: 500 , bgcolor: 'transparent',boxShadow:0}}>
        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label={dict.email}
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{bgcolor:'white'}}
            />

            <FormControl variant="outlined" required sx={{bgcolor:'white'}}>
              <InputLabel id="affiliation-label">{dict.country}</InputLabel>
              <Select
                labelId="affiliation-label"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
              >
                <MenuItem value="">
                  <em>{dict.select}</em>
                </MenuItem>
                {countryList.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2, background: "linear-gradient(90deg, #0200BA 0%, #6103B0 100%)"}}
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
