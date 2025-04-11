// src/components/VaultModal.tsx
"use client";

import React, { useEffect } from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop"; // 커스텀 훅 import
import styles from "@/styles/coachBoard.module.css";

export default function VaultModal({
  isOpen,
  onClose,
  gender,
  coachId,
  players,
}) {
  const 도마1 = useDragAndDrop<{ player_name: string; skill_number: string }>(
    []
  );
  const 도마2 = useDragAndDrop<{ player_name: string; skill_number: string }>(
    []
  );

  useEffect(() => {
    도마1.setItems([]);
    도마2.setItems([]);
  }, [gender]);

  const handleAddPlayer = (category: "도마1" | "도마2", playerName: string) => {
    if (category === "도마1") {
      도마1.setItems((prev) => [
        ...prev,
        { player_name: playerName, skill_number: "" },
      ]);
    } else {
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

  return (
    <div className={styles.vaultModalContainer}>
      <p>클릭 시 추가됩니다</p>
      <section className={styles.addPlayer}>
        <h2>1차 선수추가</h2>
        {players[gender]?.map((player, index) => (
          <button
            key={index}
            onClick={() => handleAddPlayer("도마1", player.name)}
          >
            {player.name}
          </button>
        ))}
      </section>

      <ul className={styles.vaultList}>
        {도마1.items.map((player, index) => (
          <li
            key={index}
            draggable
            onDragStart={() => 도마1.handleDragStart(index, "도마1")}
            onDragOver={도마1.handleDragOver}
            onDrop={() => 도마1.handleDrop(index, "도마1")}
          >
            {player.player_name}
            <input
              type="text"
              value={player.skill_number}
              onChange={(e) => {
                const updatedList = [...도마1.items];
                updatedList[index].skill_number = e.target.value;
                도마1.setItems(updatedList);
              }}
              placeholder="기술 번호 입력"
            />
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete("도마1", index)}
            >
              <img src="/icon/cancel.png" alt="삭제" />
            </button>
          </li>
        ))}
      </ul>

      <section className={styles.addPlayer}>
        <h2>2차 선수추가</h2>
        {players[gender]?.map((player, index) => (
          <button
            key={index}
            onClick={() => handleAddPlayer("도마2", player.name)}
          >
            {player.name}
          </button>
        ))}
      </section>

      <ul className={styles.vaultList}>
        {도마2.items.map((player, index) => (
          <li
            key={index}
            draggable
            onDragStart={() => 도마2.handleDragStart(index, "도마2")}
            onDragOver={도마2.handleDragOver}
            onDrop={() => 도마2.handleDrop(index, "도마2")}
          >
            {player.player_name}
            <input
              type="text"
              value={player.skill_number}
              onChange={(e) => {
                const updatedList = [...도마2.items];
                updatedList[index].skill_number = e.target.value;
                도마2.setItems(updatedList);
              }}
              placeholder="기술 번호 입력"
            />
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete("도마2", index)}
            >
              <img src="/icon/cancel.png" alt="삭제" />
            </button>
          </li>
        ))}
      </ul>

      <section className={styles.bottomButton}>
        <button onClick={onClose}>Close</button>
        <button>저장</button>
      </section>
    </div>
  );
}
