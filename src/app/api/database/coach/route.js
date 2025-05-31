import { NextResponse } from "next/server";
import db from "@/lib/db.js";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coach_id");

    if (!coachId) {
      return NextResponse.json(
        { success: false, message: "코치 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const [rows] = await db.query("SELECT * FROM coach WHERE id = ?", [
      coachId,
    ]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "해당 코치가 없습니다." },
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

// POST 함수
export async function POST(req) {
  try {
    const { figCode, affiliation } = await req.json();

    if (!figCode|| !affiliation) {
      return NextResponse.json(
        { success: false, message: "Please fill out all fields." },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM coach WHERE figCode = ? AND affiliation = ? ",
      [figCode, affiliation]
    );

    if (rows.length > 0) {
      const token = jwt.sign(
        { id: rows[0].id, name: rows[0].name },
        process.env.JWT_SECRET // 환경변수에서 비밀키 가져오기
      );
      return NextResponse.json({
        success: true,
        message: "Login success",
        token,
        id: rows[0].id,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Login failed" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
