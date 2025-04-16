"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/coachBoard.module.css";
import VaultModal from "./vaultModal";
import { VaultItem, Player, PlayerEvent } from "@/types/player";

export default function CoachPlayer() {
  const [players, setPlayers] = useState<Record<string, Player[]>>({
    남: [],
    여: [],
  });

  const [newPlayer, setNewPlayer] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [gender, setGender] = useState<"남" | "여">("남");

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["마루", "안마", "링", "도마", "평행봉", "철봉"],
    여: ["도마", "이단 평행봉", "평균대", "마루"],
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
        const newPlayers = data.filter((p) => !existingNames.has(p.name));
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
          if (item.event_name.includes("도마")) {
            vaultData.push(item);
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

      delete formattedEventData["도마"]; //도마는 ui만 렌더링 되도록 함

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
              id="name"
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
              <button
                className={styles.deleteButton}
                onClick={() => handleRemove(player.name)}
              >
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
              <div className={styles.valutDetail}>
                <button onClick={handleValutModal}>상세설정</button>
              </div>
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
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemoveFromEvent(event, name)}
                    >
                      <img src="/icon/cancel.png" alt="삭제" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {isVault && (
        <VaultModal
          onClose={handleValutModal}
          players={players}
          gender={gender}
          vaultList={detailVault}
          onSave={(newList) => {
            setDetailVault(newList);
          }}
        ></VaultModal>
      )}

      <button className={styles.submit} onClick={handleSubmit}>
        제출
      </button>
    </div>
  );
}
