"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Coach } from "@/types/player";
import Image from 'next/image';
import { getCodeByName } from "../data/country/countryList";
import Flag from "react-world-flags";
import { capitalizeWords } from "./capitalWords/capitalWords";

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
          {capitalizeWords(coachData?.name ?? '')}
      </Typography>

      {coachData ? (
        <>
          <Box sx={{ display: "flex",flexWrap: "wrap",gap:5, mb: 5}}>
            <InfoItem label={dict.country} value={coachData.affiliation} />
            <InfoItem label={"FIG ID"} value={coachData.figCode} img={"/icon/name.png"}/>
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


function InfoItem({ label, value ,img}: {label:string,value:string,img?:string}) {
  return (
    <Box sx={{ display: 'flex', gap:2}}>
    {img && 
    <Image src={img} alt="name" width={20} height={20} />
    }
    <Box sx={{display:"flex", alignItems:"center"}}> 
      <Typography variant="body2" color="text.secondary">
    {label === "Country"
    ?  

    getCodeByName(value) === "TW" ? (
      <Image
        src="/country/TPE.png"
        alt="Chinese Taipei"
        width={24}
        height={15}
        style={{ marginRight: 8,boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)" }}
      />
    ) : (
      <Flag
        code={`${getCodeByName(value)}`}
        style={{
          width: 24,
          height: 14,
          marginRight: 8,
          lineHeight: 0,
          boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
        }}
      />
    )
    : `${label} : `}
    </Typography>
      <Typography variant="body1" sx={{fontSize:"18px"}}> {value}</Typography>
    </Box>
    </Box>
  );
}
