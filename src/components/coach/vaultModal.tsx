// src/components/VaultModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { VaultModalProps } from "@/types/player";
import { isVaultCode } from "../data/vaultReg/vaultData";
import {
  Box,
  Button,
  Typography,

  List,
} from "@mui/material";
import { motion } from "framer-motion";
import VaultDraggableList from "./drag/vaultDraggleList";
import { DndContext, closestCenter,useSensor, useSensors , PointerSensor} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function VaultModal({
  onClose,
  gender,
  players,
  vaultList,
  onSave,
  dict,
}: VaultModalProps) {
  const [도마1, set도마1] = useState<{ player_name: string; skill_number: string }[]>([]);
  const [도마2, set도마2] = useState<{ player_name: string; skill_number: string }[]>([]);
  const [hint1, setHint1] = useState(true);
  const [hint2, setHint2] = useState(true);

  useEffect(() => {
    set도마1([]);
    set도마2([]);
    const validNames = new Set(players[gender]?.map((p) => p.name) || []);

    const 도마1Data = vaultList
      .filter((item) => item.event_name === "도마1" && validNames.has(item.player_name))
      .map((item) => ({ player_name: item.player_name, skill_number: String(item.skill_number) }));

    const 도마2Data = vaultList
      .filter((item) => item.event_name === "도마2" && validNames.has(item.player_name))
      .map((item) => ({ player_name: item.player_name, skill_number: String(item.skill_number) }));

    set도마1(도마1Data);
    set도마2(도마2Data);
  }, [gender, vaultList, players]);

  const handleAddPlayer = (category: "도마1" | "도마2", playerName: string) => {
    const list = category === "도마1" ? 도마1 : 도마2;
    const setList = category === "도마1" ? set도마1 : set도마2;

    if (list.some((item) => item.player_name === playerName)) return;

    setList([...list, { player_name: playerName, skill_number: "" }]);
  };


  // 삭제 함수
  const handleDelete = (category: "도마1" | "도마2", index: number) => {
    const setList = category === "도마1" ? set도마1 : set도마2;
    const list = category === "도마1" ? 도마1 : 도마2;
    setList(list.filter((_, i) => i !== index));
  };

  // 저장 함수
  const handleSave = () => {
    const newVaultList = [
      ...도마1.map((item, idx) => ({ event_name: "도마1" as const, player_name: item.player_name, skill_number: item.skill_number, sequence: idx + 1 })),
      ...도마2.map((item, idx) => ({ event_name: "도마2" as const, player_name: item.player_name, skill_number: item.skill_number, sequence: idx + 1 })),
    ];
    onSave(newVaultList);
    onClose();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 2 } })
  );


  // 리스트 렌더링
  const renderDraggableList = (
    list: typeof 도마1,
    setList: typeof set도마1,
    hintSetter: typeof setHint1,
    category: "도마1" | "도마2"
  ) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const oldIndex = list.findIndex((item) => item.player_name === active.id);
          const newIndex = list.findIndex((item) => item.player_name === over?.id);
          setList(arrayMove(list, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext items={list.map((item) => item.player_name)} strategy={verticalListSortingStrategy}>
        <List>
          {list.map((player, index) => (
            <VaultDraggableList
              key={player.player_name}
              id={player.player_name}
              player_name={player.player_name}
              skill_number={player.skill_number}
              onSkillChange={(val) => {
                const updated = [...list];
                updated[index].skill_number = val;
                setList(updated);
                hintSetter(isVaultCode(val, gender));
              }}
              onDelete={() => handleDelete(category, index)}
            />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );


 
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(0,0,0,0.5)", zIndex: 900 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ position: "fixed", top: "50%", left: "50%", zIndex: 1000 }}
      >
        <Box p={3} sx={{ border: "2px solid #f4f4f4", borderRadius: 2, boxShadow: 5, bgcolor: "white", width: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
          <Typography variant="body2" gutterBottom>{dict.clickInfo}</Typography>

          <Box mb={2}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "info.light", mr: 1 }}>{dict.R1}</Typography>
              <Typography variant="h6">{dict.addPlayer1}</Typography>
            </Box>
            {players[gender]?.map((player, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                sx={{ m: 0.5, bgcolor: "secondary.light", border: 0, color: "#425065" }}
                onClick={() => handleAddPlayer("도마1", player.name)}
              >
                {player.name}
              </Button>
            ))}
          </Box>

          {renderDraggableList(도마1, set도마1, setHint1, "도마1")}
          {!hint1 && <Typography color="error" variant="caption" sx={{ ml: 1 }}>{dict.vaultVaild}</Typography>}

          <Box mt={3} mb={2}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mr: 1 }}>{dict.R2}</Typography>
              <Typography variant="h6">{dict.addPlayer2}</Typography>
            </Box>
            {players[gender]?.map((player, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                sx={{ m: 0.5, bgcolor: "secondary.light", border: 0, color: "#425065" }}
                onClick={() => handleAddPlayer("도마2", player.name)}
              >
                {player.name}
              </Button>
            ))}
          </Box>

          {renderDraggableList(도마2, set도마2, setHint2, "도마2")}
          {!hint2 && <Typography color="error" variant="caption" sx={{ ml: 1 }}>{dict.vaultVaild}</Typography>}

          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onClose} sx={{ color: "black" }}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
