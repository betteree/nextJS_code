"use client";

import React, { useState, useEffect } from "react";

export default function VaultModal({ isOpen, onClose, gender, coachId }) {
  const [vaultData, setVaultData] = useState<{
    도마1: string[];
    도마2: string[];
  }>({
    도마1: [],
    도마2: [],
  });
  const [newPlayer, setNewPlayer] = useState<{
    player_name: string;
    skill_number: string;
  }>({
    player_name: "",
    skill_number: "",
  });

  useEffect(() => {
    if (!isOpen || !gender || !coachId) return;

    fetch(`/api/database/event?gender=${gender}&coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data) => {
        const vaultData1 = data.filter((item) => item.event_name === "도마1");
        const vaultData2 = data.filter((item) => item.event_name === "도마2");

        // 도마1, 도마2의 선수 이름과 기술 번호를 함께 설정
        const 도마1Data = vaultData1.map((item) => ({
          player_name: item.player_name,
          skill_number: item.skill_number,
        }));
        const 도마2Data = vaultData2.map((item) => ({
          player_name: item.player_name,
          skill_number: item.skill_number,
        }));

        setVaultData({
          도마1: 도마1Data,
          도마2: 도마2Data,
        });
      })
      .catch((err) => console.error("Error fetching vault data:", err));
  }, [gender, coachId]);

  const handleAddPlayer = (eventName: string) => {
    if (!newPlayer.player_name || !newPlayer.skill_number) {
      alert("선수 이름과 기술 번호를 입력해주세요.");
      return;
    }

    // 새 선수 추가
    setVaultData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[eventName].push(newPlayer);
      return updatedData;
    });

    setNewPlayer({ player_name: "", skill_number: "" }); // 입력값 초기화
  };

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <div>
        <section>
          <h2>도마1 선수추가</h2>
          <button onClick={() => handleAddPlayer("도마1")}>선수이름</button>
        </section>
        <h2>도마1</h2>
        <ul>
          <li>
            홍길동
            <input type="text" />
          </li>
        </ul>
        <section>
          <h2>도마1 선수추가</h2>
          <button>선수이름</button>
        </section>
        <h2>도마2</h2>
        <ul>
          {vaultData.도마2.map((player, index) => (
            <li key={index}>
              {player.player_name}
              <input type="text" defaultValue={player.skill_number} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
