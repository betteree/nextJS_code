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
  const body = await req.json();

  if (!Array.isArray(body) || body.length === 0) {
    return NextResponse.json(
      { error: "Invalid data format. Expected an array of players." },
      { status: 400 }
    );
  }

  // 성별별로 선수 삭제 후 추가
  try {
    const { gender, competitionId } = body[0];

    if (!gender || !competitionId) {
      return NextResponse.json(
        { error: "Gender and Competition ID are required" },
        { status: 400 }
      );
    }

    // 해당 성별의 선수 데이터를 삭제
    await pool.query("DELETE FROM player WHERE gender = ?", [gender]);

    // 새로운 선수 데이터 추가
    for (const player of body) {
      const { name, coachId } = player;

      if (!name || !coachId) {
        return NextResponse.json(
          { error: "Name and Coach ID are required" },
          { status: 400 }
        );
      }

      // 새로운 선수만 추가
      const [playerInsertResult] = await pool.query(
        "INSERT INTO player (name, gender, coach_id) VALUES (?, ?, ?)",
        [name, gender, coachId]
      );

      const playerId = playerInsertResult.insertId;

      await pool.query(
        "INSERT INTO player_competition (player_id, competition_id) VALUES (?, ?)",
        [playerId, competitionId]
      );
    }

    return NextResponse.json({ message: "Players updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
