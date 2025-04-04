"use client";

import { useState } from "react";
import styles from "@/styles/coachBoard.module.css";

export default function CoachPlayer() {
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [newPlayer, setNewPlayer] = useState("");
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    // 기존동작 방지해서 드롭이 가능하도록 한다
  };

  const handleDrop = (index) => {
    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);

    setItems(newItems);
    setDraggedIndex(null);
  };

  const handleAddPlayer = () => {
    if (!newPlayer.trim()) return;

    setVaultItems([...vaultItems, newPlayer]);
    setBarItems([...barItems, newPlayer]);
    setParallelBarItems([...parallelBarItems, newPlayer]);

    setNewPlayer(""); // 입력값 초기화
  };
  return (
    <div className={styles.playerContainer}>
      <header>
        <h2>선수 등록</h2>
        <span>
          <label htmlFor="name" className="sr-only">
            name
          </label>
          <input
            type="text"
            placeholder="홍길동"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
          />
        </span>
        <button onClick={handleAddPlayer}>추가</button>
      </header>
      <button>배치</button>
      <section className={styles.playerList}>
        <div className={styles.partContainer}>
          <h3>도마 순서</h3>
          <ul>
            {items.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>철봉 순서</h3>
          <ul>
            {items.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>평행봉 순서</h3>
          <ul>
            {items.map((name, index) => (
              <li
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
