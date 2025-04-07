import styles from "@/styles/adminBoard.module.css";
export default function Request() {
  return (
    <div className={styles.container}>
      <section className={styles.contestDetail}>
        <h3>요청 LIST</h3>
      </section>

      <table className={styles.contestTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>지도자</th>
            <th>학교명</th>
            <th>전화번호</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>홍길동</td>
            <td>대구체육고등학교</td>
            <td>010-1234-5678</td>
            <td>
              <button>수락</button>
              <button>반려</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
