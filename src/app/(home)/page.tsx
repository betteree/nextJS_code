"use client"

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from '@mui/material';

export default function HomePage() {
  const [type, setType] = useState<string>('/admin_page');
  const [lang, setLang] = useState<string>('Korea');

  // SelectChangeEvent 타입을 사용하여 이벤트 핸들링
  const handleType = (e: SelectChangeEvent<string>) => {
    setType(e.target.value);  // e.target.value는 string 타입
  };

  const handleLang = (e: SelectChangeEvent<string>) => {
    setLang(e.target.value);  // e.target.value는 string 타입
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        메인
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '50%',
          gap: 2,
        }}
      >
        <FormControl variant="standard">
          <InputLabel htmlFor="lang">언어</InputLabel>
          <Select id="lang" value={lang} onChange={handleLang}>
            <MenuItem value="Korea">한국어</MenuItem>
            <MenuItem value="English">영어</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="type">타입</InputLabel>
          <Select id="type" value={type} onChange={handleType}>
            <MenuItem value="/">선택</MenuItem>
            <MenuItem value="/admin_page">관리자</MenuItem>
            <MenuItem value="/coach_page">지도자</MenuItem>
          </Select>
        </FormControl>

        <Link href={type} passHref legacyBehavior>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              fontSize: 15,
              borderRadius: 1,
              padding: '5px',
              textAlign: 'center',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            component="a"
          >
            적용
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
