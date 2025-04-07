import { NextResponse } from "next/server";
import pool from "@/lib/db.js"; // MySQL 연결 파일

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table"); // 🔥 테이블 이름을 쿼리 파라미터로 받음

  if (!table) {
    return NextResponse.json(
      { error: "Table name is required" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\``); // 🔥 동적 테이블 조회
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, start_date, end_date, location, organizer, gender } =
      await req.json();
    // 성별 배열을 문자열로 변환
    const genderString = Array.isArray(gender) ? gender.join(",") : gender;
    // MySQL INSERT 쿼리 실행
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
