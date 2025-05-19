// src/components/VaultModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop"; // 커스텀 훅 import
import { VaultModalProps } from "@/types/player";
import { isVaultCode } from "../data/vaultReg/vaultData";
import {
  Box,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function VaultModal({
  onClose,
  gender,
  players,
  vaultList,
  onSave,
  dict
}: VaultModalProps) {
  const 도마1 = useDragAndDrop<{ player_name: string; skill_number: string }>(
    []
  );
  const 도마2 = useDragAndDrop<{ player_name: string; skill_number: string }>(
    []
  );

  const [hint1, sethint1] = useState(true);
  const [hint2, sethint2] = useState(true);

  useEffect(() => {
    도마1.setItems([]);
    도마2.setItems([]);

    // 해당 gender 선수 목록
    const validNames = new Set(players[gender]?.map((p) => p.name) || []);

    const 도마1Data = vaultList
      .filter(
        (item) =>
          item.event_name === "도마1" && validNames.has(item.player_name)
      )
      .map((item) => ({
        player_name: item.player_name,
        skill_number: String(item.skill_number),
      }));

    const 도마2Data = vaultList
      .filter(
        (item) =>
          item.event_name === "도마2" && validNames.has(item.player_name)
      )
      .map((item) => ({
        player_name: item.player_name,
        skill_number: String(item.skill_number),
      }));

    도마1.setItems(도마1Data);
    도마2.setItems(도마2Data);
  }, [gender, vaultList, players]);

  const handleAddPlayer = (category: "도마1" | "도마2", playerName: string) => {
    if (category === "도마1") {
      const isAlreadyIn도마1 = 도마1.items.some(
        (item) => item.player_name === playerName
      );
      if (isAlreadyIn도마1) return;

      도마1.setItems((prev) => [
        ...prev,
        { player_name: playerName, skill_number: "" },
      ]);
    } else {
      const isAlreadyIn도마2 = 도마2.items.some(
        (item) => item.player_name === playerName
      );
      if (isAlreadyIn도마2) return;

      도마2.setItems((prev) => [
        ...prev,
        { player_name: playerName, skill_number: "" },
      ]);
    }
  };

  // 삭제 함수
  const handleDelete = (category: "도마1" | "도마2", index: number) => {
    if (category === "도마1") {
      도마1.setItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      도마2.setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 저장함수 (저장 후 부모에 넘겨줌)

  const handleSave = () => {
    const newVaultList = [
      ...도마1.items.map((item, idx) => ({
        event_name: "도마1" as const,
        player_name: item.player_name,
        skill_number: item.skill_number,
        sequence: idx + 1,
      })),
      ...도마2.items.map((item, idx) => ({
        event_name: "도마2" as const,
        player_name: item.player_name,
        skill_number: item.skill_number,
        sequence: idx + 1,
      })),
    ];

    onSave(newVaultList);
    onClose();
  };

  return (
     <Box p={3} sx={{
    border: "2px solid dodgerblue",
    borderRadius: 2, 
    boxShadow: 3,
    marginTop: 2,
  }}>
      <Typography variant="body2" gutterBottom>
        {dict.clickInfo}
      </Typography>

      {/* 1차 선수추가 */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          {dict.addPlayer1}
        </Typography>
        {players[gender]?.map((player, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            sx={{ m: 0.5 }}
            onClick={() => handleAddPlayer("도마1", player.name)}
          >
            {player.name}
          </Button>
        ))}
      </Box>

      <List sx={{
      }}>
        {도마1.items.map((player, index) => (
          <ListItem
            key={index}
            draggable
            onDragStart={() => 도마1.handleDragStart(index, "도마1")}
            onDragOver={도마1.handleDragOver}
            onDrop={() => 도마1.handleDrop(index, "도마1")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:"space-between",
              gap: 2,
              border: "1px solid dodgerblue",
              bgcolor: "#edf1fd",
              borderRadius: 1,
              marginBottom:"5px",
            }}
          >
            <Typography>{player.player_name}</Typography>
            <TextField
              variant="outlined"
              size="small"
              value={player.skill_number}
              onChange={(e) => {
                const updatedList = [...도마1.items];
                updatedList[index].skill_number = e.target.value;
                도마1.setItems(updatedList);
                sethint1(isVaultCode(e.target.value, gender));
              }}
                placeholder={dict.enterSkill}
               sx={{bgcolor: "#fff"}}
            />
            <IconButton
              onClick={() => handleDelete("도마1", index)}
              size="small"
              color="error"
            >
              <CancelIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      {!hint1 && (
        <Typography color="error" variant="caption" sx={{ ml: 1 }}>
         {dict.vaultVaild}
        </Typography>
      )}

      {/* 2차 선수추가 */}
      <Box mt={3} mb={2}>
        <Typography variant="h6" gutterBottom>
          {dict.addPlayer2}
        </Typography>
        {players[gender]?.map((player, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            sx={{ m: 0.5 }}
            onClick={() => handleAddPlayer("도마2", player.name)}
          >
            {player.name}
          </Button>
        ))}
      </Box>

      <List>
        {도마2.items.map((player, index) => (
          <ListItem
            key={index}
            draggable
            onDragStart={() => 도마2.handleDragStart(index, "도마2")}
            onDragOver={도마2.handleDragOver}
            onDrop={() => 도마2.handleDrop(index, "도마2")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:"space-between",
              gap: 2,
              border: "1px solid dodgerblue",
              bgcolor: "#edf1fd",
              borderRadius: 1,
              marginBottom:"5px",
            }}
          >
            <Typography>{player.player_name}</Typography>
            <TextField
              variant="outlined"
              size="small"
              value={player.skill_number}
              onChange={(e) => {
                const updatedList = [...도마2.items];
                updatedList[index].skill_number = e.target.value;
                도마2.setItems(updatedList);
                sethint2(isVaultCode(e.target.value, gender));
              }}
              placeholder={dict.enterSkill}
               sx={{bgcolor: "#fff"}}
            />
            <IconButton
              onClick={() => handleDelete("도마2", index)}
              size="small"
              color="error"
            >
              <CancelIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
     {!hint2 && (
        <Typography color="error" variant="caption" sx={{ ml: 1 }}>
         {dict.vaultVaild}
        </Typography>
      )}
      {/* 하단 버튼 */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
