import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "전화번호가 필요합니다." },
        { status: 400 }
      );
    }

    const [rows] = await pool.query("SELECT * FROM coach WHERE phone = ?", [
      phone,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: "코치를 찾을 수 없습니다.",
      });
    }

    return NextResponse.json({ success: true, coach: rows[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
// 등록 insert 함수
export async function POST(req) {
  try {
    const { title, start_date, end_date, location, organizer, gender } =
      await req.json();
    // 성별 배열을 문자열로 변환
    const genderString = Array.isArray(gender) ? gender.join(",") : gender;

    const [result] = await pool.query(
      `INSERT INTO competition (title, start_date,end_date, location, organizer, gender, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, start_date, end_date, location, organizer, genderString, 1]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
