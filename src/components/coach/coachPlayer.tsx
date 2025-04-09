"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/coachBoard.module.css";

export default function CoachPlayer() {
  const [players, setPlayers] = useState<Record<string, Player[]>>({
    남: [],
    여: [],
  });
  const [playerList, setPlayerList] = useState([
    "김나은",
    "박지민",
    "이서연",
    "최민수",
    "정하늘",
  ]);
  const [vaultItems, setVaultItems] = useState([
    "김나은",
    "박지민",
    "이서연",
    "최민수",
    "정하늘",
  ]);
  const [barItems, setBarItems] = useState([
    "김나은",
    "박지민",
    "이서연",
    "최민수",
    "정하늘",
  ]);
  const [parallelBarItems, setParallelBarItems] = useState([
    "김나은",
    "박지민",
    "이서연",
    "최민수",
    "정하늘",
  ]);
  const [newPlayer, setNewPlayer] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [coachId, setCoachId] = useState(null);
  const [gender, setGender] = useState("남");

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["마루", "안마", "링", "도마", "평행봉", "철봉"],
    여: ["도마", "이단 평행봉", "평균대", "마루"],
  };
  const [eventData, setEventData] = useState<Record<string, string[]>>({});

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

    setPlayers((prev) => ({
      ...prev,
      [gender]: [...(prev[gender] || []), { name: newPlayer }],
    }));

    setEventData((prev) => {
      const updatedData = { ...prev };

      eventCategories[gender].forEach((event) => {
        updatedData[event] = [...(updatedData[event] || []), newPlayer];
      });

      return updatedData;
    });

    setNewPlayer("");
  };

  // 랜덤 배치
  const handleShffle = () => {
    setEventData((prev) => {
      const shuffledData = { ...prev };

      Object.keys(shuffledData).forEach((event) => {
        shuffledData[event] = [...shuffledData[event]].sort(
          () => Math.random() - 0.5
        );
      });

      return shuffledData;
    });
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
      console.log(data);
    };

    fetchPlayers();
  }, [gender]);

  // 종목 별로 순서 받아오기
  useEffect(() => {
    const coachId = localStorage.getItem("userId");
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

        setEventData(categorizedData);
      })
      .catch((err) => {
        console.error("Error fetching event list:", err);
      });
  }, [gender]);

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
          </div>
        ))}
      </section>
      <button className={styles.submit}>제출</button>
    </div>
  );
}
