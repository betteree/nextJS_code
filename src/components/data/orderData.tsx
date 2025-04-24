import { ResultType } from "@/types/result";

export function getOrderData(data) {
  const result: ResultType = {
    first: null,
    second: null,
  };
  if (data.event_name === "도마1") {
    result.first = data.skill_number; // 또는 원하는 문자열 필드
  } else if (data.event_name === "도마2") {
    result.second = data.skill_number;
  }

  return { first: result.first, second: result.second };
}
