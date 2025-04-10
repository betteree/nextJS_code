import { NextResponse } from "next/server";
import pool from "@/lib/db.js"; // MySQL 연결 파일

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get("gender");
  const coachId = searchParams.get("coach_id");

  if (!gender || !coachId) {
    return NextResponse.json(
      { error: "Gender and coach_id are required" },
      { status: 400 }
    );
  }

  try {
    const query = `
        SELECT 
        e.id AS event_id,
        e.name AS event_name,
        e.gender AS event_gender,
        p.id AS player_id,
        p.name AS player_name,
        p.coach_id,
        pe.sequence AS sequence,
        vs.skill_number
        FROM event_list e
        JOIN player_event pe ON e.id = pe.event_list_id
        JOIN player p ON pe.player_id = p.id
        LEFT JOIN vault_skills vs ON pe.id = vs.player_event_id  -- vault_skills 테이블 조인
        WHERE e.gender = ? AND p.coach_id = ?
        AND e.name IN ('도마1', '도마2')  -- 도마1, 도마2만 필터링
        ORDER BY e.id, pe.sequence
      `;

    const [rows] = await pool.query(query, [gender, coachId]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const { eventData, coachId, gender } = await req.json(); // 클라이언트에서 전달된 데이터

  if (!eventData || !coachId || !gender) {
    return NextResponse.json(
      { error: "eventData, coachId, and gender are required" },
      { status: 400 }
    );
  }

  try {
    // player_event 테이블에 데이터 삽입
    const insertPromises = [];

    // 각 종목별로 선수들을 순서대로 추가
    Object.keys(eventData).forEach((eventName) => {
      if (eventName === "도마") return;

      const players = eventData[eventName];

      // event_list_id는 종목에 따라 다르므로 종목 이름을 기반으로 event_list_id를 찾음
      let eventListId = null;
      if (gender === "남") {
        if (eventName === "마루") eventListId = 1;
        else if (eventName === "안마") eventListId = 2;
        else if (eventName === "링") eventListId = 3;
        else if (eventName === "평행봉") eventListId = 6;
        else if (eventName === "철봉") eventListId = 7;
      } else if (gender === "여") {
        if (eventName === "이단 평행봉") eventListId = 10;
        else if (eventName === "평균대") eventListId = 11;
        else if (eventName === "마루") eventListId = 12;
      }

      if (!eventListId) {
        throw new Error(`Invalid event name: ${eventName}`);
      }

      // 각 선수에 대해 player_event 테이블에 삽입
      players.forEach((playerName, index) => {
        const playerInsertQuery = `
          INSERT INTO player_event (player_id, sequence, event_list_id)
          SELECT p.id, ?, ?
          FROM player p
          WHERE p.name = ? AND p.coach_id = ?
          ON DUPLICATE KEY UPDATE sequence = VALUES(sequence);
        `;
        insertPromises.push(
          pool.query(playerInsertQuery, [
            index + 1, // 순서 번호는 1부터 시작
            eventListId,
            playerName,
            coachId,
          ])
        );
      });
    });

    await Promise.all(insertPromises);

    return NextResponse.json({ message: "Player events added successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
