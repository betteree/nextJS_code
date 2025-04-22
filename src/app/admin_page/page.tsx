"use client";

import styles from "@/styles/adminBoard.module.css";
import { useState } from "react";
import ContestList from "@/components/admin/contestList";
import Request from "@/components/admin/request";
import Sequence from "@/components/admin/sequence";
export default function AdminPage() {
  const [adminList, setAdminList] = useState("contest");

  const handleNav = (list: string) => {
    setAdminList(list);
  };
  return (
    <div className={styles.container}>
      <nav>
        <h2>관리자</h2>
        <ul>
          <li>
            <button
              onClick={() => handleNav("contest")}
              className={adminList === "contest" ? styles.active : ""}
            >
              대회 LIST
            </button>
          </li>
          {/* <li>
            <button
              onClick={() => handleNav("request")}
              className={adminList === "request" ? styles.active : ""}
            >
              요청 LIST
            </button>
          </li> */}
          <li>
            <button
              onClick={() => handleNav("sequence")}
              className={adminList === "sequence" ? styles.active : ""}
            >
              선수 순서
            </button>
          </li>
        </ul>
      </nav>
      {adminList === "contest" ? (
        <ContestList></ContestList>
      ) : (
        <Sequence></Sequence>
      )}
    </div>
  );
}
