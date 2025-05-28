"use client";

import { Box} from "@mui/material";
import CoachInfo from "@/components/coach/coachInfo";
import CoachPlayer from "@/components/coach/coachPlayer";
import { use } from 'react';
import { getDictionary } from "@/components/dictionaries/dictionaries";
import NavBar from "@/components/public/navBar";

export default function Contest({ params }: { params: Promise<{ lang: string }> }) {

  const { lang } = use(params);
  const dict = getDictionary(lang as 'ko' | 'en');

  return (
    <Box
      sx={{
        backgroundColor: "#F8F9FD",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        touchAction: "manipulation"
      }}
    >
      <NavBar dict={dict} type={dict.coach}/>

     <Box
       sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4, 
        width: "100%",
        mt: 5, 
        mb:5,
      }}
  >
   <Box
    sx={{
      backgroundColor: "white",
      boxShadow: 1,
      borderRadius: 1,
      width: "80%",
      p: 3,
    }}
  >
    <CoachInfo dict={dict} />
  </Box>

  <Box
    sx={{
      backgroundColor: "white",
      boxShadow: 2,
      borderRadius: 2,
      width: "80%",
      p: 3,
      position:"relative"
    }}
  >
    <CoachPlayer lang={lang} dict={dict} />
  </Box>
</Box>
    </Box>
  );
}
