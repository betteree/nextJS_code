"use client";

import { useState } from "react";

export default function CoachPlayer() {
  const [items, setItems] = useState([
    "김나은",
    "박지민",
    "이서연",
    "최민수",
    "정하늘",
  ]);
  return (
    <div>
      <header>
        <h2>선수 등록</h2>
        <span>
          <label htmlFor="name" className="sr-only">
            name
          </label>
          <input type="text" placeholder="홍길동" />
        </span>
        <button>추가</button>
      </header>

      <section>
        <ul>
          {items.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
