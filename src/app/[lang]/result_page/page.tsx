// Converted to MUI
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import ResultNav from "@/components/result/resultNav";
import ResultFooter from "@/components/result/resultFooter";
import { VaultItem, VaultFormatted, PlayerEvent } from "@/types/player";
import { use } from 'react';
import { getDictionary } from "@/components/dictionaries/dictionaries";
import PrintIcon from '@mui/icons-material/Print';
import '@/app/global.css'
import { capitalizeWords } from "@/components/coach/capitalWords/capitalWords";
import Image from 'next/image';

export default function Result({ params }: { params: Promise<{ lang: string }> }) {
  const [gender, setGender] = useState<"남" | "여">("남");
  const [eventData, setEventData] = useState<Record<string, string[]>>({});
  
  
  const { lang } = use(params);
  const dict = getDictionary(lang as 'ko' | 'en');

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["FX", "PH", "SR", "Vault", "PB", "HB"],
    여: ["Vault", "UB", "BB", "FX"],
  };

  // 종목풀네임
  const eventNameMap: Record<string, string> = {
  FX: "Floor Exercise",
  PH: "Pommel Horse",
  SR: "Rings",
  Vault: "Vault",
  PB: "Parallel Bars",
  HB: "Horizontal Bar",
  UB: "Uneven Bars",
  BB: "Balance Beam",
}

  // 도마 1차시, 2차시
  const [detailVault, setDetailVault] = useState<VaultFormatted>({
    first: [],
    second: [],
  });




  // 성별 전환
  const handleGender = (
    _event: React.MouseEvent<HTMLElement>,
    newGender: "남" | "여"
  ) => {
    if (newGender !== null) {setGender(newGender)
    };
    
  };


  // 선수 순서 데이터 받아오기
  useEffect(() => {
    const coachId = localStorage.getItem("coach") as string;
    if (!gender || !coachId) return;

    fetch(`/api/database/event?gender=${gender}&coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data: PlayerEvent[]) => {
        const categorizedData: Record<string, string[]> = {};
        const vaultData: VaultItem[] = [];
        eventCategories[gender].forEach((event) => {
          categorizedData[event] = [];
        });
        data.forEach((item) => {
          if (categorizedData[item.event_name]) {
            categorizedData[item.event_name].push(item.player_name);
          }
          if (item.event_name === "도마1" || item.event_name === "도마2") {
            vaultData.push(item as VaultItem);
          }
        });
        setDetailVault(formatVaultDetail(vaultData));
        setEventData(categorizedData);
      })
      .catch((err) => console.error("Error fetching event list:", err));
  }, [gender]);

  // 도마 1차시, 도마 2차시 상세
  const formatVaultDetail = (data: VaultItem[]): VaultFormatted => {
    const first = data
      .filter((d) => d.event_name === "도마1")
      .map((item) => ({
        player_name: item.player_name,
        skill_number: item.skill_number?.toString() || "-",
      }));

    const second = data
      .filter((d) => d.event_name === "도마2")
      .map((item) => ({
        player_name: item.player_name,
        skill_number: item.skill_number?.toString() || "-",
      }));

    return { first, second };
  };


  


  // 프린트 함수
   const handlePrint = () => {
    window.print(); 
  };
  return (
    <Box >

      < ResultNav dict={dict} gender={gender}/>

      <Box my={2} className="no-print" paddingInline={3}  display={"flex"} justifyContent={"space-between"}>
        <ToggleButtonGroup
          value={gender}
          exclusive
          onChange={handleGender}
          aria-label="gender toggle"
        >
          <ToggleButton value="남" sx={{width:"70px", padding:"5px"}}>{dict.m}</ToggleButton>
          <ToggleButton value="여" sx={{width:"70px", padding:"5px"}}>{dict.f}</ToggleButton>
        </ToggleButtonGroup>

        
      <Button variant="outlined"  startIcon={<PrintIcon />}  onClick={handlePrint} >Print</Button>
      </Box>

      <Box
      sx={{
    display: "grid",
    paddingInline:3,
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(2, 1fr)", 
    },
    gap: 2,
  }}>
        {eventCategories[gender].map((event) => {
          const data = eventData[event] || [];
          const sequence = Array.from({ length: data.length }, (_, i) => i + 1);

          return (
           <Box key={event} >
           <Box sx={{display:"flex" , alignItems:"center",gap:2}}>
              <Image src={`/icon/eventDark/${event}.png`} alt="info" width={35} height={35} />   
                <Typography sx={{fontSize:"16px",fontWeight:"bold"}}>{eventNameMap[event]}</Typography>
              </Box>
              <TableContainer component={Paper} sx={{ my: 3  , margin:"0",boxShadow:0}}>
                <Table>
                  <TableHead sx={{
                  borderBottom : "3px solid black",
                  "& th": {
                      padding: "5px",},
                }}>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>{dict.name}</TableCell>
                      {event === "Vault" && (
                        <>
                          <TableCell>{dict.Vault1}</TableCell>
                          <TableCell>{dict.Vault2}</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody
             sx={{
                "& td": {
                fontSize: "12px",
                fontWeight:"500",
                padding:"3px",
                 },
                  }}
                  >
                    {event === "Vault" ? (
                      detailVault.first.length > 0 || detailVault.second.length > 0 ? (
                        <>
                          {detailVault.first.map((firstItem, index) => {
                            const secondItem = detailVault.second.find(
                              (item) => item.player_name === firstItem.player_name
                            );
  
                            return (
                              <TableRow key={`vault-${index}`}
                         
                              >
                               
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{capitalizeWords(firstItem.player_name)}</TableCell>
                                <TableCell>{firstItem.skill_number}</TableCell>
                                <TableCell >{secondItem?.skill_number || "-"}</TableCell>
                              </TableRow>
                            );
                          })}
  
                          {detailVault.second
                            .filter(
                              (s) =>
                                !detailVault.first.some(
                                  (f) => f.player_name === s.player_name
                                )
                            )
                            .map((secondItem, idx) => (
                              <TableRow key={`vault-second-${idx}`}>
                                <TableCell>{
                                  idx + detailVault.first.length + 1
                                }</TableCell>
                                <TableCell>{secondItem.player_name}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>{secondItem.skill_number}</TableCell>
                              </TableRow>
                            ))}
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>There is no information.</TableCell>
                        </TableRow>
                      )
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3}>There is no information.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((name, index) => (
                        <TableRow key={`${event}-${index}`}>
                          <TableCell>{sequence[index]}</TableCell>
                          <TableCell>{capitalizeWords(name)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
           </Box>
          );
        })}
      </Box>


      <ResultFooter/>
    </Box>
  );
}
