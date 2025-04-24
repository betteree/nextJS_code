"use client";

import styles from "@/styles/coachBoard.module.css";

export default function Approve() {
  // 임시 학교 데이터
  const schoolList = [
    "북부초등학교",
    "남부초등학교",
    "대구체육고등학교",
    "제주삼다수",
    "한국체육대학교",
    "공주대학교",
  ];

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const requestData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      affiliation: formData.get("affiliation") as string,
    };

    const response = await fetch("/api/database/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.id);
      alert("로그인 되었습니다");
      window.location.reload();
    } else {
      console.log(result);
      alert(result.message);
    }
  }
  return (
    <div className={styles.Approvecontainer}>
      <h2>지도자</h2>
      <section>
        <form onSubmit={handleLogin}>
          <span>
            <label htmlFor="name">이름</label>
            <input type="text" name="name" id="name" />
          </span>
          <span>
            <label htmlFor="phone">연락처</label>
            <input type="text" name="phone" id="phone" />
          </span>

          <span>
            <label htmlFor="affiliation">소속</label>
            <select name="affiliation" id="affiliation" defaultValue="">
              <option value="">학교선택</option>
              {schoolList.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </span>
          <button type="submit">로그인</button>
        </form>
      </section>
    </div>
  );
}
