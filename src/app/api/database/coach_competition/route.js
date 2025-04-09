import { NextResponse } from "next/server";
import db from "@/lib/db.js";

// POST 함수
export async function POST(req) {
  try {
    const { coach_id, competition_id } = await req.json();

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
