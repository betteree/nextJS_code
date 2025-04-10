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

export async function POST(req) {
  const { name, gender, coachId } = await req.json();

  // 입력값이 비어있는지 확인
  if (!name || !gender || !coachId) {
    return NextResponse.json(
      { error: "Name, Gender, and Coach ID are required" },
      { status: 400 }
    );
  }

  try {
    // 선수 추가 로직
    const [existingPlayer] = await pool.query(
      "SELECT * FROM player WHERE name = ? AND gender = ? AND coach_id = ?",
      [name, gender, coachId]
    );

    if (existingPlayer.length > 0) {
      return NextResponse.json(
        { error: "Player already exists" },
        { status: 400 }
      );
    }

    await pool.query(
      "INSERT INTO player (name, gender, coach_id) VALUES (?, ?, ?)",
      [name, gender, coachId]
    );

    return NextResponse.json({ message: "Player added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
