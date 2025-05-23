"use client";

import { useState, useEffect,useRef } from "react";
import VaultModal from "./vaultModal";
import { VaultItem, Player, PlayerEvent } from "@/types/player";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, TextField, Button,IconButton,
  List,
  ListItem,
  Paper } from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import Image from 'next/image';


export default function CoachPlayer({lang,dict}:{lang:string,dict:Record<string, string>}) {
  const [players, setPlayers] = useState<Record<string, Player[]>>({
    남: [],
    여: [],
  });
  const router = useRouter(); // 페이지 이동 변수 정의
  const [newPlayer, setNewPlayer] = useState(""); // 새로운 선수 추가
  const [gender, setGender] = useState<"남" | "여">("남");

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["FE", "PH", "SR", "Vault", "PB", "HB"],
    여: ["Vault", "UB", "BB", "FE"],
  };

  // 각 종목의 순서 리스트데이터
  const [eventData, setEventData] = useState<Record<string, string[]>>({});

  // 도마 모달 상태관리 함수
  const [isVault, setIsVault] = useState(false);
  const [detailVault, setDetailVault] = useState<VaultItem[]>([]);
  // 코치아이디
  const [coachId, setCoachId] = useState("");

   const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // 드래그 시작: 드래그하는 아이템 index 저장
  const dragStart = (e: React.DragEvent<HTMLLIElement>, index: number, category: string) => {
    dragItem.current = index;
    setCurrentCategory(category);
  };

  // 드래그 엔터: 드래그 오버 중인 아이템 index 저장
  const dragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragOverItem.current = index;
  };

  // 드래그 오버: 기본 이벤트 막아 드롭 가능하게 함
  const dragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

 const drop = (e: React.DragEvent<HTMLLIElement>, category: string) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null) return;

    if (category !== currentCategory) return;

    const newList = [...eventData[category]];
    const draggedItem = newList[dragItem.current];

    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, draggedItem);

    setEventData((prev) => ({
      ...prev,
      [category]: newList,
    }));

    dragItem.current = null;
    dragOverItem.current = null;
  };

  // 선수 추가
  const handleAddPlayer = () => {
    if (!newPlayer.trim()) return;

    const isDuplicate = players[gender].some(
      (player) => player.name === newPlayer.trim()
    );

    if (isDuplicate) {
      alert("이미 존재하는 선수입니다.");
      return;
    }
    setPlayers((prev) => ({
      ...prev,
      [gender]: [...(prev[gender] || []), { name: newPlayer }],
    }));

    // setEventData((prev) => {
    //   const updatedData = { ...prev };

    //   eventCategories[gender].forEach((event) => {
    //     updatedData[event] = [...(updatedData[event] || []), newPlayer];
    //   });

    //   return updatedData;
    // });

    setNewPlayer("");
  };

  // 랜덤 배치
  const handleShffle = () => {
    const shuffledEventData = { ...eventData };

    // 각 종목마다 선수 목록을 랜덤으로 섞기
    Object.keys(shuffledEventData).forEach((event) => {
      shuffledEventData[event] = [...players[gender]]
        .map((player) => player.name)
        .sort(() => Math.random() - 0.5);
    });

    setEventData(shuffledEventData);
  };

  // 삭제
  const handleRemove = (removePlayer: string) => {
    setPlayers((prev) => ({
      ...prev,
      [gender]: prev[gender].filter((player) => player.name !== removePlayer),
    }));

    setEventData((prev) => {
      const updatedData = { ...prev };

      eventCategories[gender].forEach((event) => {
        updatedData[event] =
          updatedData[event]?.filter((name) => name !== removePlayer) || [];
      });

      return updatedData;
    });
  };

  // 종목별 삭제
  const handleRemoveFromEvent = (event: string, playerName: string) => {
    setEventData((prevData) => {
      const updatedData = { ...prevData };

      // 해당 종목에서 선수를 삭제
      updatedData[event] = updatedData[event].filter(
        (name) => name !== playerName
      );

      return updatedData;
    });
  };

  // 성별 바꾸기
  const handleGender = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value as "남" | "여";
    setGender(value);
  };

  // 남녀 별 선수목록
  useEffect(() => {
    const coachId = localStorage.getItem("coach");
    if (!gender || !coachId) return;

    const fetchPlayers = async () => {
      const res = await fetch(
        `/api/database/player?coach_id=${coachId}&gender=${gender}`
      );
      const data = await res.json();

      // 이미 로컬에서 추가한 선수가 있을 경우 중복 제거
      setPlayers((prev) => {
        const existingNames = new Set(prev[gender]?.map((p) => p.name));
        const newPlayers = data.filter(
          (p: Player) => !existingNames.has(p.name)
        );
        return {
          ...prev,
          [gender]: [...prev[gender], ...newPlayers],
        };
      });
    };

    fetchPlayers();
  }, [gender]);

  // 종목 별로 순서 받아오기
  useEffect(() => {
    const coachId = localStorage.getItem("coach") as string;
    setCoachId(coachId);
    if (!gender || !coachId) return;

    fetch(`/api/database/event?gender=${gender}&coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data: PlayerEvent[]) => {
        const categorizedData: Record<string, string[]> = {};
        const vaultData: VaultItem[] = [];
        // 종목별 초기화
        eventCategories[gender].forEach((event) => {
          categorizedData[event] = [];
        });

        // 데이터 분류
        data.forEach((item) => {
          if (categorizedData[item.event_name]) {
            categorizedData[item.event_name].push(item.player_name);
          }
          if (item.event_name === "도마1" || item.event_name === "도마2") {
            vaultData.push(item as VaultItem);
          }
        });
        setDetailVault(vaultData);
        setEventData(categorizedData);
      })
      .catch((err) => {
        console.error("Error fetching event list:", err);
      });
  }, [gender]);

  // 도마 상세 모달창
  const handleValutModal = () => {
    setIsVault((isVault) => !isVault);
  };

  async function handleSubmit() {
    try {
      const playersToSave = [...players[gender]]; //선수 목록 가져오기
      const competitionId = localStorage.getItem("competitionId");

      // 데이터
      const playerData = playersToSave.map((player) => ({
        name: player.name,
        gender: gender,
        coachId: coachId,
        competitionId: competitionId,
      }));

      // 선수 정보 저장
      const playerResponse = await fetch("/api/database/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      });

      const playerResponseData = await playerResponse.json();
      if (!playerResponse.ok) {
        throw new Error(playerResponseData.error || "선수 저장 실패");
      }

      // eventData 수정
      const formattedEventData: {
        도마1: VaultItem[];
        도마2: VaultItem[];
        [key: string]: VaultItem[];
      } = {
        ...eventData,
        도마1: detailVault.filter((item) => item.event_name === "도마1"),
        도마2: detailVault.filter((item) => item.event_name === "도마2"),
      };

      delete formattedEventData["Vault"]; //도마는 ui만 렌더링 되도록 함

      // 종목별 선수 순서 저장
      const eventResponse = await fetch("/api/database/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coachId: coachId,
          gender: gender,
          eventData: formattedEventData,
        }),
      });

      const eventDataResponse = await eventResponse.json();
      if (!eventResponse.ok) {
        throw new Error(`종목별 순서 저장 실패: ${eventDataResponse.error}`);
      }

      alert("Submission complete");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("에러가 발생했습니다: " + error.message);
        console.error("에러:", error);
      } else {
        console.error("알 수 없는 에러:", error);
      }
    }
  }

  function handleNav() {
    router.push(`/${lang}/result_page`);
  }

  return (
  <>
   <Box sx={{ p: { xs: 2, sm: 4 }}}>
  {/* 성별 선택 */}
  <Box display="flex" justifyContent="center" gap={2} mb={3}>
    <Button
      variant={gender === "남" ? "contained" : "outlined"}
      value="남"
      onClick={handleGender}
      sx={{
      boxShadow: gender === "남" ? 'none' : 1,
      border:"0"
    }}
    >
      {dict.m}
    </Button>
    <Button
      variant={gender === "여" ? "contained" : "outlined"}
      value="여"
      onClick={handleGender}
      sx={{
      boxShadow: gender === "여" ? 'none' : 1,
      border:"0"
    }}
    >
       {dict.f}
    </Button>
  </Box>

  {/* 선수 등록 헤더 */}
  <Box component="header" mb={4}>
    <Typography variant="h5" fontWeight={500} gutterBottom>
      💡{dict.playerRegistration}
    </Typography>
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        id="name"
        label={dict.playerName}
        variant="outlined"
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
        size="small"
        sx={{width:"60%"}}
      />
      <Button variant="contained" onClick={handleAddPlayer}>
        {dict.add}
      </Button>
    </Box>
  </Box>

  {/* 선수 목록 */}
  <Box
    sx={{
      border: "2px solid lightgray",
      borderRadius: "5px",
      p: 2,
      my: 2,
    }}
  >
    <Typography variant="subtitle1" sx={{ color: "black", mb: 2 }}>
      {dict.playerList}
    </Typography>
    <Box
      component="ul"
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        listStyle: "none",
        p: 0,
        m: 0,
      }}
    >
      <AnimatePresence>
        {players[gender]?.map((player) => (
          <motion.li
            key={player.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              fontSize: "inherit",
              backgroundColor:"#F7F7F7"
            }}
          >
            {player.name}
            <IconButton
              onClick={() => handleRemove(player.name)}
              sx={{
                pl: 1,
                ml: 1,
                height: 25,
              }}
            >
              <CancelIcon color="secondary" sx={{ width: 25, height: 25 }} />
            </IconButton>
          </motion.li>
        ))}
      </AnimatePresence>
    </Box>
  </Box>

  {/* 랜덤배치 버튼 */}
  <Button
    variant="contained"
    onClick={handleShffle}
    sx={{
      background: 'linear-gradient(90deg, #0200BA 0%, #6103B0 100%)',
      color: "#fff",
      fontWeight: "bold",
      py: 0.5,
      borderRadius: "4px",
      width: "100%",
      fontSize:"18px",
      boxShadow:"0",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    }}
  >
    {dict.random}
  </Button>

  {/* 안내 메시지 */}
  <Box  sx={{
        my: 2,
        backgroundColor: "#f8f9fa",
        p: 2,
      }}>
    <Typography
     sx={{fontSize: "18px",
      fontWeight: "bold",}}
      >
      🎯
      {dict.dragInfo} <br/>
     
    </Typography>
    <Typography sx={{ whiteSpace: 'pre-line', fontSize:"12px", ml:"25px"}}>{dict.detaildarg}</Typography>
  </Box>

  {/* 종목 별 리스트 */}
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {eventCategories[gender].map((event) => {
        const playersInEvent = eventData[event];
        const isVaultEvent = event === "Vault";
        if (!isVaultEvent && (!playersInEvent || playersInEvent.length === 0)) {
          return null;
        }

        return (
          <Box key={event} sx={{ flex: "1 1 calc(33% - 16px)", boxSizing: "border-box" }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "white",
                boxShadow:0,
                border:"2px solid #F7F7F7"
              }}
            >

              <Box
                sx={{
                  backgroundColor: "#5417D6",
                  textAlign: "center",
                  py: 0.5,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              >
              <Image src={`/icon/event/${event}.png`} alt="info" width={45} height={45} />   
              </Box>

              {isVaultEvent ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", m: 2 }}>
                  <Button variant="outlined"  fullWidth onClick={handleValutModal} color="info">
                    {dict.detailedSettings}
                  </Button>
                </Box>
              ) : (
                <List sx={{ p: 2 }}>
      {eventData[event]?.map((name, index) => (
        <ListItem
          key={`${event}-${index}-${name}`}
          component="li"
          draggable
          onDragStart={(e) => dragStart(e, index,event)}
          onDragEnter={(e) => dragEnter(e, index)}
          onDragOver={dragOver}
          onDrop={(e) => drop(e, event)}
          sx={{
            bgcolor: "#FAFAFA",
            mb: 1,
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            cursor: "grab",
        
          }}
        >
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Image src="/icon/sequence.png" alt="info" width={12} height={12} />
            {name}
          </Typography>
          <IconButton
            onClick={() => handleRemoveFromEvent(event, name)}
            size="small"
            color="error"
          >
            <CancelIcon color="info" />
          </IconButton>
        </ListItem>
      ))}
    </List>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>



  {/* 하단 제출/최종 버튼 */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 2,
      mt: 4,
      flexWrap: "wrap",
    }}
  >
    <Button
      variant="outlined"
      color="primary"
      onClick={handleNav}
      sx={{ fontWeight:"bold",px: 4 ,color:"black", width:"25%",borderColor:"linear-gradient(90deg, #0200BA 0%, #6103B0 100%);"}}
    >
      {dict.result}
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      sx={{ fontWeight:"bold",px: 4, width:"25%", background:"linear-gradient(90deg, #0200BA 0%, #6103B0 100%);"}}
    >
     {dict.submit}
    </Button>
  </Box>
</Box>
  {/* Vault Modal */}
  {isVault && (
   
      <VaultModal
        onClose={handleValutModal}
        players={players}
        gender={gender}
        vaultList={detailVault}
        onSave={(newList) => {
          setDetailVault(newList);
        }}
        dict={dict}
      />
   
  )}
  </>
  );
}