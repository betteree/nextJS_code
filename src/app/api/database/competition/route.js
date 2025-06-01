import { NextResponse } from "next/server";
import db from "@/lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const competitionId = searchParams.get("id");

    if (!competitionId) {
      return NextResponse.json(
        { success: false, message: "대회 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const [rows] = await db.query("SELECT * FROM competition WHERE id = ?", [
      competitionId,
    ]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "해당 대회가 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
