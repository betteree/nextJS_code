export interface Player {
  id?: number;
  name: string;
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
