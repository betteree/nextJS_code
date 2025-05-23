export interface Player {
  id?: number;
  name: string;
  coach_id?: number;
  gender?: "남" | "여";
}

// 도마 타입
export interface VaultItem {
  event_name: "도마1" | "도마2";
  player_name: string;
  skill_number: string | number;
  sequence?: number;
  coach_id?: number;
  event_gender?: "남" | "여";
  event_id?: number;
  player_id?: number;
}

// 도마 함수 타입
export interface VaultModalProps {
  onClose: () => void;
  gender: "남" | "여";
  players: {
    남?: Player[];
    여?: Player[];
  };
  vaultList: VaultItem[];
  onSave: (vaultData: VaultItem[]) => void;
  dict:Record<string, string>;
}

// 도마 외 종목 타입
export interface PlayerEvent {
  event_name: string;
  player_name: string;
  skill_number: number | null;
  sequence: number;
  coach_id: number;
  event_gender: "남" | "여";
  event_id: number;
  player_id: number;
}

// 도마 1차시 , 2차시 타입
export interface VaultFormatted {
  first: {
    player_name: string;
    skill_number: string;
  }[];
  second: {
    player_name: string;
    skill_number: string;
  }[];
}

// 대회 정보 타입
export type Admin = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer: string;
  gender: string;
};

// 코치 타입
export type Coach = {
  affiliation: string;
  email:string;
};

// 등록 모달 타입 정의
export interface RegisterProps {
  itemData: Admin | null;
  isClose: (item: Admin | null) => void;
}

// 대회 title,id 타입
export type Contest = {
  title: string;
  id: string;
};

// 드래그 인수 타입
export interface DraggableProps {
  id: string;
  onDelete: () => void;
}
