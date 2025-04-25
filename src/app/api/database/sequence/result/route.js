import { NextResponse } from "next/server";
import pool from "@/lib/db"; // DB 커넥션 풀 (설정에 따라 경로 조정 필요)

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const competitionId = searchParams.get("competition_id");

  // competition_id가 없으면 에러 응답
  if (!competitionId) {
    return NextResponse.json(
      { error: "competition_id is required" },
      { status: 400 }
    );
  }

  try {
    const query = `
   SELECT 
    e.id AS event_id,
    e.name AS event_name,
    e.gender AS event_gender,
    p.id AS player_id,
    p.name AS player_name,
    p.coach_id,
    pe.sequence AS sequence,
    vs.skill_number,
    c.affiliation AS coach_affiliation 
FROM event_list e
JOIN player_event pe ON e.id = pe.event_list_id
JOIN player p ON pe.player_id = p.id
LEFT JOIN vault_skills vs ON pe.id = vs.player_event_id
JOIN coach_competition cc ON p.coach_id = cc.id -- coach_competition 테이블을 join
JOIN coach c ON cc.coach_id = c.id -- coach 테이블을 join하여 affiliation을 가져옵니다.
WHERE cc.competition_id = ? -- competition_id에 해당하는 코치들만 필터링
ORDER BY e.id, pe.sequence;

    `;

    const [rows] = await pool.query(query, [competitionId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("쿼리 실행 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
