import { NextResponse } from "next/server";
import pool from "@/lib/db.js"; // MySQL 연결 파일
// 값을 받아오는 함수
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table"); // 테이블 이름을 쿼리 파라미터로 받음

  if (!table) {
    return NextResponse.json(
      { error: "Table name is required" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\``);

    const formattedRows = rows.map((row) => ({
      ...row,
      start_date: row.start_date
        ? row.start_date.toISOString().split("T")[0]
        : null,
      end_date: row.end_date ? row.end_date.toISOString().split("T")[0] : null,
    }));

    return NextResponse.json(formattedRows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

export async function PUT(req) {
  try {
    const { id, title, start_date, end_date, location, organizer, gender } =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID가 필요합니다." },
        { status: 400 }
      );
    }

    const genderString = Array.isArray(gender) ? gender.join(",") : gender;

    const [result] = await pool.query(
      `UPDATE competition 
       SET title = ?, start_date = ?, end_date = ?, location = ?, organizer = ?, gender = ?
       WHERE id = ?`,
      [title, start_date, end_date, location, organizer, genderString, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "수정할 데이터가 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
