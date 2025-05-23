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

  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const countryList = [
  { code: "AU", name: "Australia" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" },
  { code: "CN", name: "China" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "RU", name: "Russia" },
  { code: "SE", name: "Sweden" },
  { code: "TR", name: "Turkey" },
  { code: "US", name: "USA" },
  { code: "ZA", name: "South Africa" },
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
      alert("LOGIN SUCESSFUL");
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
                  label={dict.email}
                  variant="outlined"
                  value={email}
                   type="email"  
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{bgcolor:'white'}}
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
