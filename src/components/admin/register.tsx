"use client";
import styles from "@/styles/adminBoard.module.css";
import { RegisterProps } from "@/types/player";

export default function Register({ itemData, isClose }: RegisterProps) {
  const organization = ["대한체조협회", "체조협회", "고등체조협회"];
  const checkedGender = itemData?.gender?.split(",") || []; //itemData가 있고 gender가 있다면 나누고 null이거나 undefined이면 [] 빈배열
  // 등록
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id?: number
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const requestData = {
      id: id || undefined,
      title: formData.get("title") as string,
      start_date: formData.get("startday") as string,
      end_date: formData.get("endday") as string,
      location: formData.get("place") as string,
      organizer: formData.get("host") as string,
      gender: formData.getAll("gender").join(","),
    };

    const method = id ? "PUT" : "POST";
    const url = "/api/database/admin";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    if (result.success) {
      alert(id ? "수정 완료!" : "등록 완료!");
      window.location.reload();
    } else {
      alert(`${id ? "수정" : "등록"} 실패: ${result.error}`);
    }
  };

  return (
    <div className={styles.Modal}>
      <section className={styles.registerContainer}>
        <button onClick={() => isClose(null)} className={styles.close}>
          닫기
        </button>
        <form
          id="competitionForm"
          onSubmit={(e) => handleSubmit(e, itemData?.id)}
        >
          <div>
            <label htmlFor="titleInput">대회명</label>
            <input
              type="text"
              id="titleInput"
              name="title"
              defaultValue={itemData ? itemData.title : ""}
            />
          </div>
          <div>
            <label htmlFor="startdayInput">시작 날짜</label>
            <input
              type="date"
              name="startday"
              id="startdayInput"
              defaultValue={
                itemData && itemData.start_date
                  ? itemData.start_date.split("T")[0]
                  : ""
              }
              onFocus={(e) => e.target.showPicker()}
            />
          </div>
          <div>
            <label htmlFor="enddayInput">종료 날짜</label>
            <input
              type="date"
              name="endday"
              id="enddayInput"
              defaultValue={
                itemData && itemData.end_date
                  ? itemData.end_date.split("T")[0]
                  : ""
              }
              onFocus={(e) => e.target.showPicker()}
            />
          </div>
          <div>
            <label htmlFor="placeInput">장소</label>
            <input
              type="text"
              id="placeInput"
              name="place"
              defaultValue={itemData ? itemData.location : ""}
            />
          </div>
          <div>
            <label htmlFor="host">주관</label>
            <select
              name="host"
              id="host"
              defaultValue={itemData ? itemData.organizer : ""}
            >
              <option value="">기관선택</option>
              {organization.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.gender}>
            <label htmlFor="male">남자</label>
            <input
              type="checkbox"
              id="male"
              name="gender"
              value="남"
              defaultChecked={checkedGender?.includes("남") ?? false}
            />
            <label htmlFor="female">여자</label>
            <input
              type="checkbox"
              id="female"
              name="gender"
              value="여"
              defaultChecked={checkedGender?.includes("여") ?? false}
            />
          </div>
          <button type="submit">
            {itemData && Object.keys(itemData).length === 0 ? "등록" : "수정"}
          </button>
        </form>
      </section>
    </div>
  );
}
