// components/VaultModal.tsx
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Box,
  Button,
  Typography,
  List,
} from "@mui/material";
import VaultDraggableList from "./drag/vaultDraggleList";// 위에서 생성한 컴포넌트
import { VaultModalProps } from "@/types/player";
import { motion } from "framer-motion";

export default function VaultModal({
  onClose,
  gender,
  players,
  vaultList,
  onSave,
  dict,
}: VaultModalProps) {
  const [도마1, set도마1] = useState<
    { id: string; player_name: string; skill_number: string }[]
  >([]);
  const [도마2, set도마2] = useState<
    { id: string; player_name: string; skill_number: string }[]
  >([]);

  useEffect(() => {
    const validNames = new Set(players[gender]?.map((p) => p.name) || []);

    const 도마1Data = vaultList
      .filter(
        (item) =>
          item.event_name === "도마1" && validNames.has(item.player_name)
      )
      .map((item) => ({
        id: `${item.player_name}-도마1`,
        player_name: item.player_name,
        skill_number: String(item.skill_number),
      }));

    const 도마2Data = vaultList
      .filter(
        (item) =>
          item.event_name === "도마2" && validNames.has(item.player_name)
      )
      .map((item) => ({
        id: `${item.player_name}-도마2`,
        player_name: item.player_name,
        skill_number: String(item.skill_number),
      }));

    set도마1(도마1Data);
    set도마2(도마2Data);
  }, [gender, vaultList, players]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent, category: "도마1" | "도마2") => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      if (category === "도마1") {
        const oldIndex = 도마1.findIndex((item) => item.id === active.id);
        const newIndex = 도마1.findIndex((item) => item.id === over.id);
        set도마1((items) => arrayMove(items, oldIndex, newIndex));
      } else {
        const oldIndex = 도마2.findIndex((item) => item.id === active.id);
        const newIndex = 도마2.findIndex((item) => item.id === over.id);
        set도마2((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  const handleSave = () => {
    const newVaultList = [
      ...도마1.map((item, idx) => ({
        event_name: "도마1" as const,
        player_name: item.player_name,
        skill_number: item.skill_number,
        sequence: idx + 1,
      })),
      ...도마2.map((item, idx) => ({
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
  <Box
  sx={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bgcolor: "rgba(0,0,0,0.5)",
    zIndex: 900,
  }}
>
  <motion.div
    initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
    animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      zIndex: 1000,
    }}
  >
    <Box
      p={3}
      sx={{
        border: "2px solid #f4f4f4",
        borderRadius: 2,
        boxShadow: 5,
        bgcolor: "white",
        width: { xs: "90vw" },
        maxHeight: { xs: "90vh" },
        overflowY: "auto",
        p: { xs: 2 },
      }}
    >
      {/* ✅ 여기에 내용 포함 */}
      {/* 도마1 섹션 */}
      <Typography variant="h6">{dict.R1}</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, "도마1")}
      >
        <SortableContext
          items={도마1.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {도마1.map((item, index) => (
              <VaultDraggableList
                key={item.id}
                id={item.id}
                player_name={item.player_name}
                skill_number={item.skill_number}
                onSkillChange={(value) => {
                  const updated = [...도마1];
                  updated[index].skill_number = value;
                  set도마1(updated);
                }}
                onDelete={() => {
                  set도마1((items) => items.filter((_, i) => i !== index));
                }}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>

      {/* 도마2 섹션 */}
      <Typography variant="h6">{dict.R2}</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, "도마2")}
      >
        <SortableContext
          items={도마2.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {도마2.map((item, index) => (
              <VaultDraggableList
                key={item.id}
                id={item.id}
                player_name={item.player_name}
                skill_number={item.skill_number}
                onSkillChange={(value) => {
                  const updated = [...도마2];
                  updated[index].skill_number = value;
                  set도마2(updated);
                }}
                onDelete={() => {
                  set도마2((items) => items.filter((_, i) => i !== index));
                }}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>

      {/* 저장 및 닫기 버튼 */}
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
