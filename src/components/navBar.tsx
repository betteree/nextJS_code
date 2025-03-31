"use client";

import { useState } from "react";
import styles from "./../styles/navBar.module.css";

export default function NavBar() {
  const navList = ["메인", "공용 스코어 보드", "대회", "소켓"];
  const [button1, setButton] = useState<string | undefined>("메인");

  const setItems = (item: string) => {
    setButton(item);
  };

  return (
    <div>
      <span className={styles.navContainer}>
        {navList.map((item) => {
          return (
            <button key={item} onClick={() => setItems(item)}>
              {item}
            </button>
          );
        })}
        <h2>{button1}</h2>
      </span>
    </div>
  );
}
