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
    const { email, affiliation } = await req.json();

    if (!email|| !affiliation) {
      return NextResponse.json(
        { success: false, message: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM coach WHERE email = ? AND affiliation = ? ",
      [email, affiliation]
    );

    if (rows.length > 0) {
      const token = jwt.sign(
        { id: rows[0].id, name: rows[0].name },
        process.env.JWT_SECRET // 환경변수에서 비밀키 가져오기
      );
      return NextResponse.json({
        success: true,
        message: "로그인 성공",
        token,
        id: rows[0].id,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "일치하는 사용자가 없습니다." },
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
