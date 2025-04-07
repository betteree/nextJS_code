"use client";

import styles from "@/styles/coachBoard.module.css";
import { useRouter } from "next/navigation";

export default function Approve() {
  // 임시 학교 데이터
  const schoolList = [
    "충남체고",
    "대전체고",
    "경남체고",
    "광주체고",
    "전남체고",
    "충북체고",
    "울산스과고",
    "경기체고",
    "강원체고",
    "부산체고",
    "전북체고",
    "인천체고",
    "대구체고",
    "서울체고",
  ];
  const router = useRouter();
  return (
    <div className={styles.Approvecontainer}>
      <h2>지도자</h2>
      <section>
        <span>
          <label htmlFor="name">이름</label>
          <input type="text" name="name" />
        </span>
        <span>
          <label htmlFor="number">연락처</label>
          <input type="text" name="number" />
        </span>

        <span>
          <label htmlFor="host">소속</label>
          <select name="host" id="host">
            <option value="0">학교선택</option>
            {schoolList.map((item, index) => (
              <option value={index + 1} key={index + 1}>
                {item}
              </option>
            ))}
          </select>
        </span>

        <button onClick={() => router.push("/coach_board")}>로그인</button>
        <button>승인요청</button>
      </section>
    </div>
  );
}
