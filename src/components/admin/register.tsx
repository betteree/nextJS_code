import styles from "@/styles/adminBoard.module.css";

export default function Register({ isClose }) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = formData.get("title") as string;
    const start_date = formData.get("startday") as string;
    const end_date = formData.get("endday") as string;
    const location = formData.get("place") as string;
    const organizer = formData.get("host") as string;
    const gender = formData.getAll("gender").join(",");

    const response = await fetch("/api/database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        start_date,
        end_date,
        location,
        organizer,
        gender,
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert("등록 완료!");
    } else {
      alert("등록 실패: " + result.error);
    }
  };

  return (
    <div className={styles.Modal}>
      <section className={styles.registerContainer}>
        <button onClick={isClose} className={styles.close}>
          닫기
        </button>
        <form id="competitionForm" onSubmit={handleSubmit}>
          <span>
            <label htmlFor="title">대회명</label>
            <input type="text" name="title" />
          </span>
          <span>
            <label htmlFor="startday">시작 날짜</label>
            <input
              type="date"
              name="startday"
              id="startday"
              onFocus={(e) => e.target.showPicker()}
            />
          </span>
          <span>
            <label htmlFor="endday">종료 날짜</label>
            <input
              type="date"
              name="endday"
              id="endday"
              onFocus={(e) => e.target.showPicker()}
            />
          </span>
          <span>
            <label htmlFor="place">장소</label>
            <input type="text" name="place" />
          </span>
          <span>
            <label htmlFor="host">주관</label>
            <select name="host" id="host">
              <option value="0">기관선택</option>
              <option value="1">대한체육협회</option>
              <option value="2">체육연맹</option>
            </select>
          </span>
          <span className={styles.gender}>
            <label htmlFor="male">남자</label>
            <input type="checkbox" id="male" name="gender" value="남" />
            <label htmlFor="female">여자</label>
            <input type="checkbox" id="female" name="gender" value="여" />
          </span>
          <button type="submit">등록</button>
        </form>
      </section>
    </div>
  );
}
