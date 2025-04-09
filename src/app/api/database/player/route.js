import { NextResponse } from "next/server";
import pool from "@/lib/db"; // MySQL 연결을 위한 pool

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const coachId = searchParams.get("coach_id");
  const gender = searchParams.get("gender");

  if (!coachId) {
    return NextResponse.json(
      { error: "Coach ID is required" },
      { status: 400 }
    );
  }

  if (!gender) {
    return NextResponse.json({ error: "Gender is required" }, { status: 400 });
  }

  try {
    // 선수 테이블에서 코치 ID와 성별로 필터링
    const [rows] = await pool.query(
      `SELECT id, name FROM player WHERE coach_id = ? AND gender = ?`,
      [coachId, gender]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
