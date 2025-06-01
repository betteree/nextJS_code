"use client";

import { useState, useEffect } from "react";
import {
  Box, 
  Typography,
} from "@mui/material";
import Image from 'next/image';
import { Competition } from "@/types/result";
import { Coach } from "@/types/player";
import { capitalizeWords } from "../coach/capitalWords/capitalWords";
import { getCodeByName } from "../data/country/countryList";
import Flag from "react-world-flags";

export default function ResultNav({dict,gender}:{dict: Record<string,string>,gender:string}) {
  const [coachData, setCoachData] = useState<Coach>({
    affiliation: "",
    figCode:"",
    name:"",
  });
  
          
  const [competition, setCompetition] = useState<Competition | null>(null);
  
  const titleGender = gender==="남" ? "MAG" :"WAG"
  const titleAge = competition?.title.includes("SENIOR") ? "Senior" : "Junior";

  useEffect(() => {
    const competitionId = localStorage.getItem("competitionId");
    const coachId = localStorage.getItem("userId");
    fetch(`/api/database/competition?id=${competitionId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success)
        {
          setCompetition(json.data);
        }
      });

        fetch(`/api/database/coach?coach_id=${coachId}`)
          .then((res) => res.json())
          .then((data) => {
              setCoachData(data.data);
              console.log(data.data)
              localStorage.setItem("division", data.data.affiliation);
            })
            .catch((err) => {
                console.error("Error fetching coach:", err);
              }); 
  }, []);
  

    // 날짜형식 포멧 함수
  const formatDateRange = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const pad = (n: number) => String(n).padStart(2, "0");

  const startDay = pad(startDate.getDate());
  const endDay = pad(endDate.getDate());
  const month = pad(endDate.getMonth() + 1); // getMonth는 0부터 시작
  const year = endDate.getFullYear();

  return `${startDay} ~ ${endDay}/${month}/${year}`;
};

  return (
    <Box sx={{ mb: 1 }}>

      
      <Box p={3} mb={3} sx={{display:"flex" ,alignItems:"center",justifyContent:"space-between",paddingInline:2 ,borderBottom:2}}> 
      {/* 로고 1 */}  
        <Image src={"/logo/AGU.png"} alt="ASIAN GYMNASTICS UNION" width={100} height={70}/>
              {/* 대회 정보 */}
             <Box sx={{display:"flex", flexFlow:"column", alignItems:"center"}}>
                <Typography  variant="h4" textAlign={"center"} fontSize={18} fontWeight={600}>
                  {competition?.title}
                </Typography>
                <Typography  variant="body1">
                  {competition?.location}
                </Typography>
              <Typography  variant="body1" fontSize={14}>
                  {competition?.start_date && competition?.end_date
            ? formatDateRange(competition.start_date, competition.end_date)
            : " "}
          
                </Typography>
             </Box>
             {/* 로고 2 */}
        <Image src={"/logo/AGAC.png"} alt="ARTISTIC GYMNASTICS ASIAN CHAMPIONSHIPS" width={100} height={70}/>
        
        
      </Box>
      
      
            <Typography 
            variant="h4" 
            mb={2} 
            color={gender === "여" ? "secondary" : "initial"}
            sx={{
              padding: 0,
              margin:0,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 25,
            }}>
              {dict.startList}
            </Typography>
             <Typography variant="body1" 
             sx={{
            fontSize:20,
            textAlign: "center",
            
             }}> {titleAge} {titleGender}</Typography>

             <Typography textAlign={"center"}></Typography>
             
             <Typography fontSize={20} marginInline={4} marginTop={2} display={"flex"} justifyContent={"center"} alignItems={"center"}><Flag code={`${getCodeByName(coachData.affiliation)}`} style={{ width: 24, height: 16, marginRight:8,lineHeight:0 ,boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",}} />{coachData.affiliation} / {capitalizeWords(coachData.name)} </Typography>
    </Box>
  );
}
