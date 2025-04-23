import { NextResponse } from "next/server";
import pool from "@/lib/db"; // pool 설정

export async function GET() {
  try {
    const query = `
      SELECT 
        c.id AS coach_id,
        c.name AS coach_name,
        c.phone AS coach_phone,
        c.affiliation,
        cc.id AS coach_competition_id,
        comp.id AS competition_id,
        comp.title AS competition_title
      FROM coach c
      JOIN coach_competition cc ON c.id = cc.coach_id
      JOIN competition comp ON comp.id = cc.competition_id
      ORDER BY comp.id, c.id
    `;

    const [rows] = await pool.query(query);

    // 대회 ID를 기준으로 데이터 묶기
    const competitions = rows.reduce((acc, row) => {
      // 대회가 이미 존재하면 해당 대회에 코치 추가
      const competition = acc.find((c) => c.id === row.competition_id);
      if (competition) {
        competition.coaches.push({
          coach_competition_id: row.coach_competition_id,
          coach_id: row.coach_id,
          name: row.coach_name,
          phone: row.coach_phone,
          affiliation: row.affiliation,
        });
      } else {
        // 대회가 없다면 새로운 대회 객체를 추가
        acc.push({
          id: row.competition_id,
          title: row.competition_title,
          coaches: [
            {
              coach_competition_id: row.coach_competition_id,
              coach_id: row.coach_id,
              name: row.coach_name,
              phone: row.coach_phone,
              affiliation: row.affiliation,
            },
          ],
        });
      }
      return acc;
    }, []);

    return NextResponse.json(competitions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
