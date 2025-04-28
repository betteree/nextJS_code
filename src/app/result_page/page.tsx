"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/result.module.css";
import ResultCoach from "@/components/admin/resultCoach";
import { VaultItem, VaultFormatted, PlayerEvent } from "@/types/player";

export default function Result() {
  const [gender, setGender] = useState<"남" | "여">("남");
  const [eventData, setEventData] = useState<Record<string, string[]>>({});

  const eventCategories: Record<"남" | "여", string[]> = {
    남: ["마루", "안마", "링", "도마", "평행봉", "철봉"],
    여: ["도마", "이단평행봉", "평균대", "마루"],
  };

  const [detailVault, setDetailVault] = useState<VaultFormatted>({
    first: [],
    second: [],
  });

  const handleGender = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value as "남" | "여";
    setGender(value);
  };

  // 종목 별로 순서 받아오기
  useEffect(() => {
    const coachId = localStorage.getItem("coach") as string;

    if (!gender || !coachId) return;

    fetch(`/api/database/event?gender=${gender}&coach_id=${coachId}`)
      .then((res) => res.json())
      .then((data: PlayerEvent[]) => {
        const categorizedData: Record<string, string[]> = {};
        const vaultData: VaultItem[] = [];

        // 종목별 초기화
        eventCategories[gender].forEach((event) => {
          categorizedData[event] = [];
        });

        // 데이터 분류
        data.forEach((item) => {
          if (categorizedData[item.event_name]) {
            categorizedData[item.event_name].push(item.player_name);
          }
          if (item.event_name === "도마1" || item.event_name === "도마2") {
            vaultData.push(item as VaultItem);
          }
        });

        const formattedVault = formatVaultDetail(vaultData);

        setDetailVault(formattedVault);
        setEventData(categorizedData);
      })
      .catch((err) => {
        console.error("Error fetching event list:", err);
      });
  }, [gender]);

  const formatVaultDetail = (data: VaultItem[]): VaultFormatted => {
    // "도마1"과 "도마2"를 각각 찾아서 배열로 저장
    const firstVaults = data.filter((d) => d.event_name === "도마1");
    const secondVaults = data.filter((d) => d.event_name === "도마2");

    // "도마1"과 "도마2"에 대한 데이터를 각각 skill_number 배열로 가공
    const first =
      firstVaults.length > 0
        ? firstVaults.map((item) => ({
            player_name: item.player_name,
            skill_number: item.skill_number?.toString() || "-",
          }))
        : [];

    const second =
      secondVaults.length > 0
        ? secondVaults.map((item) => ({
            player_name: item.player_name,
            skill_number: item.skill_number?.toString() || "-",
          }))
        : [];

    return {
      first,
      second,
    };
  };

  return (
    <div className={styles.container}>
      <nav>
        <h1 className={gender === "여" ? styles.genderStyle : ""}>
          선수 연기순서표[{gender}자]
        </h1>
      </nav>
      <ResultCoach></ResultCoach>
      <section className={styles.genderContainer}>
        <button
          value="남"
          onClick={handleGender}
          className={gender === "남" ? styles.active : ""}
        >
          남
        </button>
        <button
          value="여"
          onClick={handleGender}
          className={gender === "여" ? styles.active : ""}
        >
          여
        </button>
      </section>

      <section className={styles.playerList}>
        {eventCategories[gender].map((event) => {
          const data = eventData[event] || [];
          const sequence = Array.from({ length: data.length }, (_, i) => i + 1);

          return (
            <table className={styles.listTable} key={event}>
              <thead>
                {event === "도마" ? (
                  <tr>
                    <th>세부 종목</th>
                    <th>시기순</th>
                    <th>선수성명</th>
                    <th>1차</th>
                    <th>2차</th>
                  </tr>
                ) : (
                  <tr>
                    <th>세부 종목</th>
                    <th>시기순</th>
                    <th>선수성명</th>
                  </tr>
                )}
              </thead>
              {event === "도마" ? (
                <tbody>
                  {Array.isArray(detailVault.first) &&
                  Array.isArray(detailVault.second) &&
                  (detailVault.first.length > 0 ||
                    detailVault.second.length > 0) ? (
                    <>
                      {detailVault.first.map((firstItem, index) => {
                        const secondItem = detailVault.second.find(
                          (item) => item.player_name === firstItem.player_name
                        );

                        return (
                          <tr key={`vault-${index}`}>
                            {index === 0 && (
                              <td
                                rowSpan={
                                  detailVault.first.length +
                                  detailVault.second.filter(
                                    (secondItem) =>
                                      !detailVault.first.some(
                                        (firstItem) =>
                                          firstItem.player_name ===
                                          secondItem.player_name
                                      )
                                  ).length
                                }
                              >
                                {event}
                              </td>
                            )}
                            <td>{index + 1}</td>
                            <td>{firstItem.player_name}</td>
                            <td>{firstItem.skill_number}</td>
                            <td>
                              {secondItem ? secondItem.skill_number : "-"}
                            </td>
                          </tr>
                        );
                      })}

                      {/* 2차에서만 남은 선수 */}
                      {detailVault.second
                        .filter(
                          (secondItem) =>
                            !detailVault.first.some(
                              (firstItem) =>
                                firstItem.player_name === secondItem.player_name
                            )
                        )
                        .map((secondItem, index) => (
                          <tr key={`vault-second-${index}`}>
                            <td>{index + detailVault.first.length + 1}</td>
                            <td>{secondItem.player_name}</td>
                            <td>-</td>
                            <td>{secondItem.skill_number}</td>
                          </tr>
                        ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5}>정보가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={3}>정보가 없습니다.</td>
                    </tr>
                  ) : (
                    data.map((name, index) => (
                      <tr key={`${event}-${index}`}>
                        {index === 0 && <td rowSpan={data.length}>{event}</td>}
                        <td>{sequence[index]}</td>
                        <td>{name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          );
        })}
      </section>
    </div>
  );
}
