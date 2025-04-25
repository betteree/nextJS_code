import { PlayerEventData } from "@/types/result";
import { getOrderData } from "./orderData";

export function getClassdata(data: PlayerEventData[], contestId: number) {
  const result = data.map((item) => {
    const {
      event_gender: gender,
      event_name: division,
      player_id: player_id,
    } = item;

    const { divisionName, divisionCode } = getDivisionInfo(division, gender);

    const SEX_CD = getGender(gender);

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
      KIND_CD: divisionCode || "",
      DETAIL_CLASS_CD: "23" + (divisionCode || "") + BASE_CLASS_CD,
      ID_NO: player_id,
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

  console.log(result);
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
    divisionName = isMale ? "남자대학" : "여자대학";
  } else {
    divisionName = isMale ? "남자일반" : "여자일반";
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
    남자대학: "2",
    남자일반: "3",
    여자18세이하부: "4",
    여자대학: "5",
    여자일반: "6",
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
