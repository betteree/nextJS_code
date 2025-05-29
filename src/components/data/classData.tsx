import { PlayerEventData, ResultRow } from "@/types/result";
import { getOrderData } from "./orderData";
import { toast } from "react-hot-toast";

// 전송 함수
async function handleSave(data: ResultRow[]) {
  const toastId = toast.loading("전송 중...");
  try {
    const promises = data.map(async (row) => {
      const response = await fetch("/api/database/sequence/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });

      const result = await response.json();

      if (result.success) {
        return result.message;
      } else {
        throw new Error(result.message);
      }
    });

    // 모든 요청이 완료될 때까지 대기하고, 모두 성공한 경우 출력
    await Promise.all(promises);
    console.log("모든 항목이 성공적으로 저장되었습니다.");
    toast.success("전송 완료!", { id: toastId });
  } catch (error) {
    console.error("연결 오류", error);
  }
}

// 데이터 가공 함수
export async function getClassdata(data: PlayerEventData[], contestId: string) {
  const resultMap = new Map<number, ResultRow>();

  data.forEach((item) => {
    const {
      coach_affiliation,
      country_code,
      coach_id,
      event_gender,
      event_name,
      player_id,
      player_name,
      sequence,
    } = item;

    const { divisionName, divisionCode } = getDivisionInfo(
      coach_affiliation,
      event_gender
    );
    const SEX_CD = getGender(event_gender); //성별 1,2로 변환

    const { name, BASE_CLASS_CD } = getBaseClassCd(event_name); //종목 코드로 변환
    const { first, second, firstValue, secondValue } = getOrderData(item, event_gender); //도마 1차시,2차시로 나누기
    const formattedSeq = String(sequence).padStart(2, "0"); //순서 01,02로 포멧

    // 도마 종목 처리
    if (BASE_CLASS_CD === "07") {
      const existing = resultMap.get(player_id);
      if (existing) {
        if (second) {
          existing.R2_VAULT_ID = second;
          existing.R2_VAULT_YN = "Y";
        }
      } else {
        // 도마1일 때 처음 저장
        resultMap.set(player_id, {
          CLASS_CD: "23",
          CLASS_SUB_CD: "1",
          COMP_CD: 1,
          BASE_CLASS_CD,
          DETAIL_CLASS_NM: name,
          TO_CD: contestId,
          SEX_CD,
          KIND_NM: divisionName,
          KIND_CD: divisionCode || "",
          DETAIL_CLASS_CD: "23" + (divisionCode || "") + BASE_CLASS_CD,
          SEX_ORDER: null,
          // order테이블
          ID_NO: player_id,
          GROUP_CD: country_code + BASE_CLASS_CD,
          ENTRANT_SEQ: formattedSeq,
          R1_VAULT_ID: first || null,
          R1_VAULT_VALUE: firstValue,
          R2_VAULT_ID: second || null,
          R2_VAULT_VALUE: secondValue,
          R2_VAULT_YN: second ? "Y" : null,
          ROTATION_SEQ: null,
          // team 테이블
          TEAM_CD: coach_id,
          TEAM_NM: coach_affiliation,
          GROUP_NM: coach_affiliation,
          //player 테이블
          KOR_NM: player_name,
        });
      }
    } else {
      // 도마가 아닌 경우는 그대로 추가
      const { name, BASE_CLASS_CD } = getBaseClassCd(event_name);

      resultMap.set(player_id + Math.random(), {
        CLASS_CD: "23",
        CLASS_SUB_CD: "1",
        COMP_CD: 1,
        BASE_CLASS_CD,
        DETAIL_CLASS_NM: name,
        TO_CD: contestId,
        SEX_CD,
        KIND_NM: divisionName,
        KIND_CD: divisionCode || "",
        DETAIL_CLASS_CD: "23" + (divisionCode || null) + BASE_CLASS_CD,
        // order테이블
        ID_NO: player_id,
        SEX_ORDER: null,
        GROUP_CD: country_code + BASE_CLASS_CD,
        ENTRANT_SEQ: formattedSeq,
        R1_VAULT_ID: null,
        R1_VAULT_VALUE: null,
        R2_VAULT_ID: null,
        R2_VAULT_VALUE: null,
        R2_VAULT_YN: null,
        ROTATION_SEQ: null,
        // team 테이블
        TEAM_CD: coach_id,
        TEAM_NM: coach_affiliation,
        GROUP_NM: coach_affiliation,
        KOR_NM: player_name,
      });
    }
  });

  const result = Array.from(resultMap.values());

  await handleSave(result);
  return result;
}

// 종목 코드로 변환하기
function getBaseClassCd(eventName: string): {
  name: string;
  BASE_CLASS_CD: string;
} {
  const rawName = eventName || "";


  // 도마1, 도마2는 도마로 통일되도록 함
  const normalizedEventName = rawName.includes("도마") ? "Vault" : rawName;

  const eventNameToBaseClassCdMap: Record<string, string> = {
    FX: "02",
    BB: "03",
    HB: "04",
    PB: "05",
    UB: "06",
    Vault: "07",
    PH: "08",
    SR: "09",
  };

  const BASE_CLASS_CD = eventNameToBaseClassCdMap[normalizedEventName] || "00";

  return {
    name: normalizedEventName,
    BASE_CLASS_CD,
  };
}

// 성별 변환하기
function getGender(gender: string) {
  const sex_id = gender === "남" ? 1 : 2;

  return sex_id;
}

/////부 나누어 주는 함수//////
function getDivisionInfo(data: string, gender: string) {
  const isMale = gender === "남";
  let divisionName = "";

  if (data.includes("중")) {
    divisionName = isMale ? "남자15세이하부" : "여자15세이하부";
  } else if (data.includes("초등")) {
    divisionName = isMale ? "남자12세이하부" : "여자12세이하부";
  } else if (data.includes("고등")) {
    divisionName = isMale ? "남자18세이하부" : "여자18세이하부";
  } else if (data.includes("대")) {
    divisionName = isMale ? "남자대학부" : "여자대학부";
  } else {
    divisionName = isMale ? "남자일반부" : "여자일반부";
  }

  const divisionCode = getDivisionCodeFromMap(divisionName); // DB 없이 맵에서 처리
  return {
    divisionName,
    divisionCode,
  };
}

// 하드코딩된 divisionCode 매핑
function getDivisionCodeFromMap(divisionName: string): string | null {
  const divisionMap: Record<string, string> = {
    남자18세이하부: "1",
    남자대학부: "2",
    남자일반부: "3",
    여자18세이하부: "4",
    여자대학부: "5",
    여자일반부: "6",
    남자초등부1학년: "A",
    남자초등부2학년: "B",
    남자초등부3학년: "C",
    남자12세이하부: "U",
    남자15세이하부: "V",
    여자초등부1학년: "F",
    여자초등부2학년: "G",
    여자초등부3학년: "H",
    여자12세이하부: "W",
    여자15세이하부: "X",
  };

  return divisionMap[divisionName] ?? null;
}
