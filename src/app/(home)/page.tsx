"use client";

import { useState } from "react";
import styles from "../../styles/home.module.css";
import Link from "next/link";

export default function HomePage() {
  const [type, setType] = useState("/admin_page");

  function handleType(e: React.ChangeEvent<HTMLSelectElement>) {
    setType(e.target.value);
  }
  return (
    <>
      <div className={styles.container}>
        <h2>메인</h2>

        <section className={styles.homeWrapper}>
          <span>
            <label htmlFor="lang">언어</label>
            <select name="lang" id="lang">
              <option value="Korea">한국어</option>
              <option value="English">영어</option>
            </select>
          </span>
          <span>
            <label htmlFor="type">타입</label>
            <select name="type" id="type" onChange={handleType}>
              <option value="/admin_page">관리자</option>
              <option value="/coach_page">지도자</option>
            </select>
          </span>

          <Link href={type} className={styles.apply}>
            적용
          </Link>
        </section>
      </div>
    </>
  );
}
