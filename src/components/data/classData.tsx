import { PlayerEventData } from "@/types/result";
import { getOrderData } from "./orderData";
// 밖 노출 함수
export async function getClassdata(
  data: PlayerEventData[],
  contestId: string,
  gender: string,
  division: string
) {
  const { divisionName, divisionCode } = await getDivisionInfo(
    division,
    gender
  );
  const SEX_CD = getGender(gender);

  const result = data.map((item) => {
    const { name, BASE_CLASS_CD } = getBaseClassCd(item.event_name);
    const { first, second } = getOrderData(item);

    return {
      origin: data,
      CLASS_CD: "23",
      CLASS_SUB_CD: "1",
      BASE_CLASS_CD,
      DETAIL_CLASS_NM: name,
      TO_CD: contestId,
      SEX_CD,
      KIND_NM: divisionName,
      KIND_CD: divisionCode,
      DETAIL_CLASS_CD: "23" + divisionCode + BASE_CLASS_CD,
      // ORDER 테이블
      ID_NO: item.player_id,
      GROUP_CD: "AA",
      ENTRANT_SEQ: "01",
      R1_VAULT_ID: first ? first : "",
      R1_VAULT_VAULE: "",
      R2_VAULT_ID: second ? second : "",
      R2_VAULT_VAULE: "",
      R2_VAULT_YN: "Y",
      ROTATION_SEQ: "",
    };
  });
}

// 종목 코드로 변환하기
function getBaseClassCd(eventName: string): {
  name: string;
  BASE_CLASS_CD: string;
} {
  const rawName = eventName || "";

  // 도마1, 도마2는 도마로 통일되도록 함
  const normalizedEventName = rawName.includes("도마") ? "도마" : rawName;

  const eventNameToBaseClassCdMap: Record<string, string> = {
    마루: "02",
    평균대: "03",
    철봉: "04",
    평행봉: "05",
    이단평행봉: "06",
    도마: "07",
    안마: "08",
    링: "09",
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
async function getDivisionInfo(data: string, gender: string) {
  const isMale = gender === "남";
  let divisionName = "";

  if (data.includes("중")) {
    divisionName = isMale ? "남자15세이하부" : "여자15세이하부";
  } else if (data.includes("초등")) {
    divisionName = isMale ? "남자12세이하부" : "여자12세이하부";
  } else if (data.includes("고등")) {
    divisionName = isMale ? "남자18세이하부" : "여자18세이하부";
  } else if (data.includes("대")) {
    divisionName = isMale ? "남자대학" : "여자대학";
  } else {
    divisionName = isMale ? "남자일반" : "여자일반";
  }

  const divisionCode = await getDivisionCodeByName(divisionName);
  return {
    divisionName,
    divisionCode,
  };
}

async function getDivisionCodeByName(
  divisionName: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `/api/database/division?division_name=${divisionName}`
    );

    if (!res.ok) {
      console.error(`서버 응답 오류: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.division_code ?? null;
  } catch (error) {
    console.error("division code 조회 중 에러:", error);
    return null;
  }
}
