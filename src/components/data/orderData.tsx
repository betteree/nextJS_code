import { ResultType, PlayerEventData } from "@/types/result";
import MAG_CODES from "@/components/data/vaultReg/MAG_Code_of_Points_2025-2028.json";
import WAG_CODES from "@/components/data/vaultReg/WAG_Code_of_Points_2025-2028.json";
export function getOrderData(data: PlayerEventData,event_gender:string) {
  const result: ResultType = {
    first: null,
    second: null,
    firstValue: null,
    secondValue: null,
  };
  
  const codeTable = event_gender === "남" ? MAG_CODES : WAG_CODES;
  const matched = codeTable.find((item) => String(item.Code) === String(data.skill_number));
  const value = matched ? matched.Value : null;

  if (data.event_name === "도마1") {
    result.first = data.skill_number; // 또는 원하는 문자열 필드
    result.firstValue = value;
  } else if (data.event_name === "도마2") {
    result.second = data.skill_number;
     result.secondValue = value;
  }


  return {first: result.first,second: result.second,firstValue: result.firstValue,secondValue: result.secondValue};
}
