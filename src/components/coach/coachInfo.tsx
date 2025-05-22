"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Coach } from "@/types/player";
import Image from 'next/image';
export default function CoachInfo({dict}:{dict:Record<string, string>}) {
  const [coachData, setCoachData] = useState<Coach | null>(null);
  const [contest, setContest] = useState<string | null>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setContest(localStorage.getItem("selectedCompetition"));
    }

    const coachId = localStorage.getItem("userId");
    fetch(`/api/database/coach?coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data) => {
        setCoachData(data.data);
      })
      .catch((err) => {
        console.error("Error fetching coach:", err);
      });
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 1 , boxShadow:"0"}}>
      <Typography variant="h5" fontWeight={600} color="black" sx={{ display:"flex" ,gap:2, alignItems:"center", mb: 3 }} gutterBottom>
         <Image src="/icon/info.png" alt="info" width={35} height={35} />
          {dict.coachInfo}
      </Typography>

      {coachData ? (
        <>
          <Box sx={{ display: "flex", justifyContent:"space-between",flexWrap: "wrap",gap:1, mb: 5}}>
            <InfoItem label={dict.name} value={coachData.name} img={"/icon/name.png"}/>
            <InfoItem label={dict.affiliation} value={coachData.affiliation} img={"/icon/affiliation.png"}/>
            <InfoItem label={dict.contact} value={coachData.phone} img={"/icon/contact.png"}/>
          </Box>
          <Divider />
          <Box mt={3}>
              <Typography variant="body1" sx={{fontSize:"18px"}}>{contest}</Typography>
          </Box>
        </>
      ) : (
        <Typography color="text.secondary">{dict.noCoachInfo}</Typography>
      )}
    </Paper>
  );
}


function InfoItem({ label, value ,img}: {label:string,value:string,img:string}) {
  return (
    <Box sx={{ display: 'flex', gap:2}}>
    {img&& 
    <Image src={img} alt="name" width={20} height={20} />
    }
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
    </Box>
  );
}
