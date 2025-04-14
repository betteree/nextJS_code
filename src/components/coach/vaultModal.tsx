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
  vaultList,
  onSave,
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

    const 도마1Data = vaultList
      .filter((item) => item.event_name === "도마1")
      .map((item) => ({
        player_name: item.player_name,
        skill_number: String(item.skill_number),
      }));

    const 도마2Data = vaultList
      .filter((item) => item.event_name === "도마2")
      .map((item) => ({
        player_name: item.player_name,
        skill_number: String(item.skill_number),
      }));

    도마1.setItems(도마1Data);
    도마2.setItems(도마2Data);
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

  // 저장함수 (저장 후 부모에 넘겨줌)

  const handleSave = () => {
    const newVaultList = [
      ...도마1.items.map((item, idx) => ({
        event_name: "도마1",
        player_name: item.player_name,
        skill_number: item.skill_number,
        sequence: idx + 1,
      })),
      ...도마2.items.map((item, idx) => ({
        event_name: "도마2",
        player_name: item.player_name,
        skill_number: item.skill_number,
        sequence: idx + 1,
      })),
    ];

    onSave(newVaultList);
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
        <button onClick={handleSave}>저장</button>
      </section>
    </div>
  );
}
