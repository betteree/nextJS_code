export interface Coach {
  coach_competition_id: string;
  coach_id: string;
  name: string;
  affiliation: string;
  phone: string;
}

export interface Contest {
  id: string;
  title: string;
  coaches: Coach[]; // Contest 객체는 coaches라는 배열을 가짐
}

export type PlayerEventData = {
  coach_id: number;
  event_gender: string;
  event_id: number;
  event_name: string;
  player_id: number;
  player_name: string;
};
