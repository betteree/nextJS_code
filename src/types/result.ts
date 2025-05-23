//코치 정보
export interface Coach {
  coach_competition_id: string;
  coach_id: string;
  affiliation: string;
  email:string;
}

// 대회 정보
export interface Contest {
  id: string;
  title: string;
  coaches: Coach[]; // Contest 객체는 coaches라는 배열을 가짐
}

// 관리자 페이지 이벤트 타입
export type PlayerEventData = {
  coach_id: number;
  event_gender: string;
  event_id: number;
  event_name: string;
  player_id: number;
  player_name: string;
  skill_number: string;
  coach_affiliation: string;
  sequence: string;
};

// 도마 1차시 ,2차시 타입
export type ResultType = {
  first: string | null;
  second: string | null;
};

// 데이터 가공 타입
export type ResultRow = {
  CLASS_CD: string;
  CLASS_SUB_CD: string;
  BASE_CLASS_CD: string;
  COMP_CD: number;
  DETAIL_CLASS_NM: string;
  TO_CD: string;
  SEX_CD: number;
  KIND_NM: string;
  KIND_CD: string;
  DETAIL_CLASS_CD: string;
  SEX_ORDER: null;
  ID_NO: number;
  GROUP_CD: number;
  ENTRANT_SEQ: string;
  R1_VAULT_ID: string | null;
  R1_VAULT_VALUE: null;
  R2_VAULT_ID: string | null;
  R2_VAULT_VALUE: null;
  R2_VAULT_YN: string | null;
  ROTATION_SEQ: null;
  TEAM_CD: number;
  TEAM_NM: string;
  GROUP_NM: string;
  KOR_NM: string;
};
