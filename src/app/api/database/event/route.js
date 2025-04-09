import { NextResponse } from "next/server";
import pool from "@/lib/db.js"; // MySQL 연결 파일

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get("gender");
  const coachId = searchParams.get("coach_id");

  if (!gender || !coachId) {
    return NextResponse.json(
      { error: "Gender and coach_id are required" },
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
          pe.sequence AS sequence
        FROM event_list e
        JOIN player_event pe ON e.id = pe.event_list_id
        JOIN player p ON pe.player_id = p.id
        WHERE e.gender = ? AND p.coach_id = ?
        ORDER BY e.id, pe.sequence;
      `;

    const [rows] = await pool.query(query, [gender, coachId]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
