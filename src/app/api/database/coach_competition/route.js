import { NextResponse } from "next/server";
import db from "@/lib/db.js";

// POST 함수
export async function POST(req) {
  try {
    const { coach_id, competition_id } = await req.json();

    const existingEntry = await db.query(
      "SELECT * FROM coach_competition WHERE coach_id = ? AND competition_id = ?",
      [coach_id, competition_id]
    );

    // 존재여부확인
    if (existingEntry.length > 0) {
      return NextResponse.json({
        success: true,
        message: "이미 등록된 대회입니다.",
      });
    }

    await db.query(
      "INSERT INTO coach_competition (coach_id, competition_id) VALUES (?, ?)",
      [coach_id, competition_id]
    );

    return NextResponse.json({ success: true, message: "등록 완료!" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
