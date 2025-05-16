"use client";

import { useState, useEffect } from "react";
import VaultModal from "./vaultModal";
import { VaultItem, Player, PlayerEvent } from "@/types/player";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, TextField, Button,IconButton,
  List,
  ListItem,
  Paper } from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

export default function CoachPlayer({lang,dict}:{lang:string,dict:Record<string, string>}) {
  const [players, setPlayers] = useState<Record<string, Player[]>>({
    남: [],
    여: [],
  });
  const router = useRouter(); // 페이지 이동 변수 정의
  const [newPlayer, setNewPlayer] = useState(""); // 새로운 선수 추가
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
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

  const handleDragStart = (index: number, category: string) => {
    setDraggedIndex(index);
    setDraggedCategory(category);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    // 기존동작 방지해서 드롭이 가능하도록 한다
  };

  // index 드롭 시에
  const handleDrop = (
    index: number,
    category: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (draggedIndex === null || draggedCategory !== category) return;

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);

    setItems(newItems);
    setDraggedIndex(null);
    setDraggedCategory(null);
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
        console.log(eventCategories[gender]);

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

      alert("제출 완료");
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
   <Box sx={{ p: { xs: 2, sm: 4 } }}>
  {/* 성별 선택 */}
  <Box display="flex" justifyContent="center" gap={2} mb={3}>
    <Button
      variant={gender === "남" ? "contained" : "outlined"}
      value="남"
      onClick={handleGender}
    >
      {dict.m}
    </Button>
    <Button
      variant={gender === "여" ? "contained" : "outlined"}
      value="여"
      onClick={handleGender}
    >
       {dict.f}
    </Button>
  </Box>

  {/* 선수 등록 헤더 */}
  <Box component="header" mb={4}>
    <Typography variant="h5" gutterBottom>
      {dict.playerRegistration}
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
              border: "2px solid dodgerblue",
              padding: "5px 10px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              fontSize: "inherit",
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
              <CancelIcon sx={{ width: 25, height: 25 }} />
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
      backgroundColor: "black",
      color: "#fff",
      fontWeight: "bold",
      py: 1,
      borderRadius: "4px",
      width: "100%",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    }}
  >
    {dict.random}
  </Button>

  {/* 안내 메시지 */}
  <Typography
    sx={{
      my: 2,
      backgroundColor: "#f8f9fa",
      color: "#333",
      fontSize: "14px",
      fontWeight: "bold",
      p: 2,
    }}
  >
    {dict.dragInfo}
  </Typography>

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
                border: "2px solid dodgerblue",
                overflow: "hidden",
                backgroundColor: "snow",
                
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  backgroundColor: "#edf1fd",
                  textAlign: "center",
                  py: 1,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              >
                {event}
              </Typography>

              {isVaultEvent ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", m: 2 }}>
                  <Button variant="outlined" fullWidth onClick={handleValutModal}>
                    {dict.detailedSettings}
                  </Button>
                </Box>
              ) : (
                <List sx={{ p: 2 }}>
                  {eventData[event]?.map((name, index) => (
                    <ListItem
                      key={`${event}-${index}-${name}`}
                      component={motion.li}
                      draggable
                      onDragStart={() => handleDragStart(index, event)}
                      onDragOver={handleDragOver}
                      onDrop={() =>
                        handleDrop(index, event, eventData[event], (newList) =>
                          setEventData((prev) => ({
                            ...prev,
                            [event]: newList as string[],
                          }))
                        )
                      }
                      sx={{
                        bgcolor: "#edf1fd",
                        border: "1px solid dodgerblue",
                        mb: 1,
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        cursor: "grab",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <Typography>{name}</Typography>
                      <IconButton onClick={() => handleRemoveFromEvent(event, name)} size="small" color="error">
                           <CancelIcon />
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

  {/* Vault Modal */}
  {isVault && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
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
    </motion.div>
  )}

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
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      sx={{ px: 4 }}
    >
     {dict.submit}
    </Button>
    <Button
      variant="outlined"
      color="primary"
      onClick={handleNav}
      sx={{ px: 4 }}
    >
      {dict.result}
    </Button>
  </Box>
</Box>

  );
}
