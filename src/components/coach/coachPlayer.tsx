"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/coachBoard.module.css";
import VaultModal from "./vaultModal";

export default function CoachPlayer() {
  const [players, setPlayers] = useState<Record<string, Player[]>>({
    남: [],
    여: [],
  });

  const [newPlayer, setNewPlayer] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [gender, setGender] = useState("남");

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["마루", "안마", "링", "도마", "평행봉", "철봉"],
    여: ["도마", "이단 평행봉", "평균대", "마루"],
  };
  // 각 종목의 순서 리스트데이터
  const [eventData, setEventData] = useState<Record<string, string[]>>({});

  const [isVault, setIsVault] = useState(false);
  const handleDragStart = (index: number, category: string) => {
    setDraggedIndex(index);
    setDraggedCategory(category);
  };

  // 코치아이디
  const [coachId, setCoachId] = useState("");

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

  // 성별 바꾸기
  const handleGender = (e) => {
    setGender(e.target.value);
  };

  // 남녀 별 선수목록
  useEffect(() => {
    const coachId = localStorage.getItem("userId");
    if (!gender || !coachId) return;

    const fetchPlayers = async () => {
      const res = await fetch(
        `/api/database/player?coach_id=${coachId}&gender=${gender}`
      );
      const data = await res.json();
      setPlayers((prev) => ({ ...prev, [gender]: data }));
    };

    fetchPlayers();
  }, [gender]);

  // 종목 별로 순서 받아오기
  useEffect(() => {
    const coachId = localStorage.getItem("userId");
    setCoachId(coachId);
    if (!gender || !coachId) return;

    fetch(`/api/database/event?gender=${gender}&coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data: PlayerEvent[]) => {
        const categorizedData: Record<string, string[]> = {};

        // 종목별 초기화
        eventCategories[gender].forEach((event) => {
          categorizedData[event] = [];
        });

        // 데이터 분류
        data.forEach((item) => {
          if (categorizedData[item.event_name]) {
            categorizedData[item.event_name].push(item.player_name);
          }
        });

        // 도마 데이터 따로 가져오기
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
    const response = await fetch("/api/database/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coachId: coachId,
        gender: gender,
        eventData: eventData,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("데이터가 성공적으로 저장되었습니다.");
    } else {
      console.error("에러:", data.error);
    }
  }
  return (
    <div className={styles.playerContainer}>
      <section className={styles.genderContainer}>
        <button value="남" onClick={handleGender}>
          남
        </button>
        <button value="여" onClick={handleGender}>
          여
        </button>
      </section>

      <header>
        <h2>선수 등록</h2>
        <div className={styles.addContainer}>
          <span>
            <label htmlFor="name" className="sr-only">
              name
            </label>
            <input
              type="text"
              placeholder="ex) 홍길동"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
            />
          </span>
          <button onClick={handleAddPlayer}>추가</button>
        </div>
      </header>

      <section className={styles.allPlayerContainer}>
        <p>선수 목록</p>
        <ul>
          {players[gender]?.map((player, index) => (
            <li key={index}>
              {player.name}
              <button onClick={() => handleRemove(player.name)}>
                <img src="/icon/cancel.png" alt="삭제" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <button onClick={handleShffle} className={styles.randomButton}>
        랜덤배치
      </button>
      <p>드래그로 순서변경이 가능합니다</p>

      <section className={styles.playerList}>
        {eventCategories[gender].map((event) => (
          <div key={event} className={styles.partContainer}>
            <h3>{event} 순서</h3>
            {event === "도마" ? (
              <button onClick={handleValutModal}>상세설정</button>
            ) : (
              <ul>
                {eventData[event]?.map((name, index) => (
                  <li
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index, event)}
                    onDragOver={handleDragOver}
                    onDrop={() =>
                      handleDrop(index, event, eventData[event], (newList) =>
                        setEventData((prev) => ({ ...prev, [event]: newList }))
                      )
                    }
                  >
                    {name}
                    <button>
                      <img src="/icon/cancel.png" alt="삭제" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
      <button className={styles.submit} onClick={handleSubmit}>
        제출
      </button>

      {isVault && (
        <VaultModal
          isOpen={isVault}
          onClose={handleValutModal}
          coachId={coachId}
          players={players}
          gender={gender}
        ></VaultModal>
      )}
    </div>
  );
}
