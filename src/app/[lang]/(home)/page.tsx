"use client"

import {  useState } from 'react';
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
import { getDictionary } from '@/components/dictionaries/dictionaries';

export default function HomePage() {
  const [lang, setLang] = useState<'ko' | 'en'>('en');
  const locale = lang;


  const dict = getDictionary(lang);

  const [type, setType] = useState<string>(`/${locale}`);

  // 타입(경로)만 변경
  const handleType = (e: SelectChangeEvent<string>) => {
    setType(e.target.value);
  };

  // 언어 변경 시 lang과 경로(type) 둘 다 변경
  const handleLang = (e: SelectChangeEvent<string>) => {
    const selectedLang = e.target.value;
    setLang(selectedLang as 'ko' | 'en');

    const newLocale = selectedLang === 'Korea' ? 'ko' : 'en';


    if (type === '/' || !type.includes(`/${locale}`)) {
      setType(`/${newLocale}`);
    } else {
      const newType = type.replace(`/${locale}`, `/${newLocale}`);
      setType(newType);
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        gap: 2,
        backgroundColor:"#F8F9FD"
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        {dict.mainTitle}
      </Typography>
      <Typography textAlign="center" mb={5} sx={{ whiteSpace: 'pre-line' }}>
        {dict.mainDes}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '70%',
          gap: 5,
        }}
      >
        <FormControl variant="outlined">
          <InputLabel htmlFor="lang">{dict.language}</InputLabel>
          <Select id="lang" value={lang} onChange={handleLang}>
            <MenuItem value="ko">한국어</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="type">{dict.type}</InputLabel>
          <Select id="type" value={type} onChange={handleType}>
            <MenuItem value={`/${locale}`}>{dict.select}</MenuItem>
            <MenuItem value={`/${locale}/admin_login`}>{dict.admin}</MenuItem>
            <MenuItem value={`/${locale}/coach_page`}>{dict.coach}</MenuItem>
          </Select>
        </FormControl>

        <Link href={type} passHref legacyBehavior>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #0200BA 0%, #6103B0 100%)',
              color: 'white',
              fontSize: 18,
              borderRadius: 1,
              padding: '10px',
              textAlign: 'center',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            component="a"
          >
            {dict.apply}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
