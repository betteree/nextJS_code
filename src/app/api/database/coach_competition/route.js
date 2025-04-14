import { NextResponse } from "next/server";
import db from "@/lib/db.js";

export async function POST(req) {
  try {
    const { coach_id, competition_id } = await req.json();

    const [rows] = await db.query(
      "SELECT id FROM coach_competition WHERE coach_id = ? AND competition_id = ?",
      [coach_id, competition_id]
    );

    if (rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: "이미 등록된 대회입니다.",
        coachCompetitionId: rows[0].id,
      });
    }

    const [insertResult] = await db.query(
      "INSERT INTO coach_competition (coach_id, competition_id) VALUES (?, ?)",
      [coach_id, competition_id]
    );

    return NextResponse.json({
      success: true,
      message: "등록 완료!",
      coachCompetitionId: insertResult.insertId,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
