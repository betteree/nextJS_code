"use client";

import React, { useState, useEffect } from "react";

export default function VaultModal({
  isOpen,
  onClose,
  gender,
  coachId,
  players,
}) {
  const [vaultData, setVaultData] = useState<{
    도마1: string[];
    도마2: string[];
  }>({
    도마1: [],
    도마2: [],
  });

  const [newSkill, setNewSkill] = useState<{
    player_name: string;
    skill_number: string;
  }>({
    player_name: "",
    skill_number: "",
  });

  useEffect(() => {
    setVaultData({
      도마1: [],
      도마2: [],
    });
  }, [gender]);

  const handleAddPlayer = (eventName: string, playerName: string) => {
    setVaultData((prevData) => {
      const updatedData = { ...prevData };

      const alreadyAdded = updatedData[eventName].some(
        (player) => player.player_name === playerName
      );
      if (!alreadyAdded) {
        updatedData[eventName].push({
          player_name: playerName,
          skill_number: "",
        });
      }
      return updatedData;
    });
  };

  const handleSkillChange = (
    eventName: string,
    index: number,
    skillNumber: string
  ) => {
    setVaultData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[eventName][index].skill_number = skillNumber;
      return updatedData;
    });
  };

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <div>
        <section>
          <h2>도마1 선수추가</h2>
          {players[gender]?.map((player, index) => (
            <button
              key={index}
              onClick={() => handleAddPlayer("도마1", player.name)}
            >
              {player.name}
            </button>
          ))}
        </section>
        <h2>도마1</h2>
        <ul>
          {vaultData.도마1.map((player, index) => (
            <li key={index}>
              {player.player_name}
              <input
                type="text"
                value={player.skill_number}
                onChange={(e) =>
                  handleSkillChange("도마1", index, e.target.value)
                }
                placeholder="기술 번호 입력"
              />
            </li>
          ))}
        </ul>

        <section>
          <h2>도마2 선수추가</h2>
          {players[gender]?.map((player, index) => (
            <button
              key={index}
              onClick={() => handleAddPlayer("도마2", player.name)}
            >
              {player.name}
            </button>
          ))}
        </section>

        <h2>도마2</h2>
        <ul>
          {vaultData.도마2.map((player, index) => (
            <li key={index}>
              {player.player_name}
              <input
                type="text"
                value={player.skill_number}
                onChange={(e) =>
                  handleSkillChange("도마2", index, e.target.value)
                }
                placeholder="기술 번호 입력"
              />
            </li>
          ))}
        </ul>
      </div>
      <button>저장</button>
    </div>
  );
}
