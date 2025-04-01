"use client";

import { useState } from "react";
import styles from "./../styles/navBar.module.css";
import Link from "next/link";

export default function NavBar() {
  const navList = [
    { name: "메인", link: "/" },
    { name: "공용 스코어 보드", link: "/admin_board" },
    { name: "대회", link: "/contest" },
    { name: "소켓", link: "/socket_page" },
  ];
  const [button1, setButton] = useState<string | undefined>("메인");

  const setItems = (item: string) => {
    setButton(item);
  };

  return (
    <div>
      <span className={styles.navContainer}>
        {navList.map((item) => {
          return (
            <Link key={item.name} href={item.link}>
              <button onClick={() => setItems(item.name)}>{item.name}</button>
            </Link>
          );
        })}
      </span>
      <h2>{button1}</h2>
    </div>
  );
}
