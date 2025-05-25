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
import Flag from "react-world-flags";

export default function Approve({dict}:{dict: Record<string, string>}) {

  const [figCode, setFigCode] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const countryList = [
  { code: "BD", name: "Bangladesh" },
  { code: "CN", name: "China" },
  { code: "TW", name: "Chinese Taipei" },
  { code: "HK", name: "Hong Kong" },
  { code: "ID", name: "Indonesia" },
  { code: "IN", name: "India" },
  { code: "IR", name: "Iran" },
  { code: "JO", name: "Jordan" },
  { code: "JP", name: "Japan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "MY", name: "Malaysia" },
  { code: "MN", name: "Mongolia" },
  { code: "MM", name: "Myanmar" },
  { code: "PH", name: "Philippines" },
  { code: "QA", name: "Qatar" },
  { code: "SG", name: "Singapore" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SY", name: "Syria" },
  { code: "TH", name: "Thailand" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" }
];



  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      figCode,
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
      alert("LOGIN SUCESSFUL");
      window.location.reload();
    } else {
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

            <FormControl variant="outlined" required sx={{bgcolor:'white'}}>
              <InputLabel id="affiliation-label">{dict.country}</InputLabel>
              <Select
                labelId="affiliation-label"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                 MenuProps={{
                PaperProps: {
              sx: {
               maxHeight: 200,  overflowY: "auto"
            }
         }
          }}
        >
    <MenuItem value="">
      <em>{dict.select}</em>
    </MenuItem>
    {countryList.map(({ code, name }) => (
      <MenuItem key={code} value={name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Flag code={code} style={{ width: 24, height: 16 }} />
        {name}
         </MenuItem>
        ))}
      </Select>
            </FormControl>
            
            <TextField
            label="FIG code"
            variant="outlined"
            value={figCode}
            type="text" // `text`로 바꾸고 숫자 필터링 직접 제어
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  setFigCode(onlyNums);
            }}
  required
  sx={{ bgcolor: 'white' }}
/>

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
