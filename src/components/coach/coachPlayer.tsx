"use client";

import { useState } from "react";
import styles from "@/styles/coachBoard.module.css";

export default function CoachPlayer() {
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

    setPlayerList([...playerList, newPlayer]);
    setVaultItems([...vaultItems, newPlayer]);
    setBarItems([...barItems, newPlayer]);
    setParallelBarItems([...parallelBarItems, newPlayer]);

    setNewPlayer(""); // 입력값 초기화
  };

  // 모든 배열
  function handleShffle() {
    shuffleArray(vaultItems, setVaultItems);
    shuffleArray(barItems, setBarItems);
    shuffleArray(parallelBarItems, setParallelBarItems);
  }

  // 랜덤 배치
  const shuffleArray = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    setArray(shuffled);
  };

  return (
    <div className={styles.playerContainer}>
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
            />
          </span>
          <button onClick={handleAddPlayer}>추가</button>
        </div>
      </header>

      <section className={styles.allPlayerContainer}>
        <p>선수 목록</p>
        <ul>
          {playerList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      <button onClick={handleShffle} className={styles.randomButton}>
        랜덤배치
      </button>
      <p>드래그로 순서변경이 가능합니다</p>

      <section className={styles.playerList}>
        <div className={styles.partContainer}>
          <h3>도마 순서</h3>
          <ul>
            {vaultItems.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index, "vault")}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(index, "vault", vaultItems, setVaultItems)
                }
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.partContainer}>
          <h3>철봉 순서</h3>
          <ul>
            {barItems.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index, "bar")}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index, "bar", barItems, setBarItems)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.partContainer}>
          <h3>평행봉 순서</h3>
          <ul>
            {parallelBarItems.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index, "parallelBar")}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(
                    index,
                    "parallelBar",
                    parallelBarItems,
                    setParallelBarItems
                  )
                }
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.partContainer}>
          <h3>도마 순서</h3>
          <ul>
            {vaultItems.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index, "vault")}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(index, "vault", vaultItems, setVaultItems)
                }
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.partContainer}>
          <h3>철봉 순서</h3>
          <ul>
            {barItems.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index, "bar")}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index, "bar", barItems, setBarItems)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.partContainer}>
          <h3>평행봉 순서</h3>
          <ul>
            {parallelBarItems.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index, "parallelBar")}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(
                    index,
                    "parallelBar",
                    parallelBarItems,
                    setParallelBarItems
                  )
                }
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <button className={styles.submit}>제출</button>
    </div>
  );
}
