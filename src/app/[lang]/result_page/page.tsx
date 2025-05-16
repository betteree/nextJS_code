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
} from "@mui/material";
import ResultCoach from "@/components/admin/resultCoach";
import { VaultItem, VaultFormatted, PlayerEvent } from "@/types/player";
import { use } from 'react';
import { getDictionary } from "@/components/dictionaries/dictionaries";

export default function Result({ params }: { params: Promise<{ lang: string }> }) {
  const [gender, setGender] = useState<"남" | "여">("남");
  const [eventData, setEventData] = useState<Record<string, string[]>>({});


  const { lang } = use(params);
   const dict = getDictionary(lang as 'ko' | 'en');

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["FE", "PH", "SR", "Vault", "PB", "HB"],
    여: ["Vault", "UB", "BB", "FE"],
  };

  const [detailVault, setDetailVault] = useState<VaultFormatted>({
    first: [],
    second: [],
  });

  const handleGender = (
    _event: React.MouseEvent<HTMLElement>,
    newGender: "남" | "여"
  ) => {
    if (newGender !== null) setGender(newGender);
  };

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

  return (
    <Box p={3}>
      <Typography 
      variant="h4" 
      mb={2} 
      color={gender === "여" ? "secondary" : "initial"}
      sx={{
        borderTop: "7px solid #ff6565",
        borderBottom: "7px solid #001694",
        paddingBlock: "20px",
        textAlign: "center",
        fontWeight: 600,
        fontSize: "35px",
        color: "#333399", 
      }}>
        선수 연기순서표[{gender}자]
      </Typography>

      <ResultCoach dict={dict}/>

      <Box my={2}>
        <ToggleButtonGroup
          value={gender}
          exclusive
          onChange={handleGender}
          aria-label="gender toggle"
        >
          <ToggleButton value="남" sx={{width:"30px", padding:"5px"}}>{dict.m}</ToggleButton>
          <ToggleButton value="여" sx={{width:"30px", padding:"5px"}}>{dict.f}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
      sx={{
    display: "grid",
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
            <TableContainer component={Paper} key={event} sx={{ my: 3 ,border : "3px solid black" , margin:"0"}}>
              <Table>
                <TableHead sx={{
                borderBottom : "3px solid black",
                "& th": {
                    padding: "10px",},
              }}>
                  <TableRow>
                    <TableCell >{dict.event}</TableCell>
                    <TableCell>{dict.sequence}</TableCell>
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
              fontSize: "14px",
              fontWeight:"500",
              padding:"5px",
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
                              {index === 0 && (
                                <TableCell
                                
                                  rowSpan={
                                    detailVault.first.length +
                                    detailVault.second.filter(
                                      (s) =>
                                        !detailVault.first.some(
                                          (f) => f.player_name === s.player_name
                                        )
                                    ).length
                                  }
                                >
                                  {event}
                                </TableCell>
                              )}
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{firstItem.player_name}</TableCell>
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
                        <TableCell colSpan={5}>정보가 없습니다.</TableCell>
                      </TableRow>
                    )
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>정보가 없습니다.</TableCell>
                    </TableRow>
                  ) : (
                    data.map((name, index) => (
                      <TableRow key={`${event}-${index}`}>
                        {index === 0 && <TableCell rowSpan={data.length}>{event}</TableCell>}
                        <TableCell>{sequence[index]}</TableCell>
                        <TableCell>{name}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          );
        })}
      </Box>
    </Box>
  );
}
