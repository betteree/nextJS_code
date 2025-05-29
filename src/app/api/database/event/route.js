import { NextResponse } from "next/server";
import pool from "@/lib/db.js"; // MySQL 연결 파일

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get("gender");
  const coachId = searchParams.get("coach_id");

  if (!coachId) {
    return NextResponse.json(
      { error: "coach_id is required" },
      { status: 400 }
    );
  }

  try {
    // gender가 있을 경우 WHERE절에 추가
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
      LEFT JOIN vault_skills vs ON pe.id = vs.player_event_id
      WHERE p.coach_id = ?
      ${gender ? "AND e.gender = ?" : ""}
      ORDER BY e.id, pe.sequence;
    `;

    // gender가 있으면 파라미터에 추가
    const params = gender ? [coachId, gender] : [coachId];
    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const { eventData, coachId, gender } = await req.json();

  if (!eventData || !coachId || !gender) {
    return NextResponse.json(
      { error: "eventData, coachId, and gender are required" },
      { status: 400 }
    );
  }

  try {
    const insertPromises = [];

    for (const eventName of Object.keys(eventData)) {
      const players = eventData[eventName];

      // event_list_id 설정
      let eventListId = null;
      if (gender === "남") {
        if (eventName === "FX") eventListId = 1;
        else if (eventName === "PH") eventListId = 2;
        else if (eventName === "SR") eventListId = 3;
        else if (eventName === "도마1") eventListId = 4;
        else if (eventName === "도마2") eventListId = 5;
        else if (eventName === "PB") eventListId = 6;
        else if (eventName === "HB") eventListId = 7;
      } else if (gender === "여") {
        if (eventName === "도마1") eventListId = 8;
        else if (eventName === "도마2") eventListId = 9;
        else if (eventName === "UB") eventListId = 10;
        else if (eventName === "BB") eventListId = 11;
        else if (eventName === "FX") eventListId = 12;
      }

      if (!eventListId) {
        throw new Error(`Invalid event name: ${eventName}`);
      }

      for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (eventName === "도마1" || eventName === "도마2") {
          const { player_name, skill_number, sequence } = player;

          await pool.query(
            `
            INSERT INTO player_event (player_id, sequence, event_list_id)
            SELECT p.id, ?, ?
            FROM player p
            WHERE p.name = ? AND p.coach_id = ? AND p.gender = ?
            ON DUPLICATE KEY UPDATE sequence = VALUES(sequence);
            `,
            [sequence, eventListId, player_name, coachId, gender]
          );

          // player_event_id 조회
          const [playerEventIdResult] = await pool.query(
            `
            SELECT pe.id
            FROM player_event pe
            JOIN player p ON pe.player_id = p.id
            WHERE p.name = ? AND p.coach_id = ? AND pe.event_list_id = ? AND p.gender = ?
            `,
            [player_name, coachId, eventListId, gender]
          );

          const playerEventId = playerEventIdResult[0]?.id;
          if (!playerEventId) throw new Error("player_event_id not found");

          // vault_skills에 저장
          insertPromises.push(
            pool.query(
              `
              INSERT INTO vault_skills (player_event_id, event_list_id, skill_number)
              VALUES (?, ?, ?)
              ON DUPLICATE KEY UPDATE skill_number = VALUES(skill_number);
            `,
              [playerEventId, eventListId, skill_number]
            )
          );
        } else {
          // 일반 종목 저장
          insertPromises.push(
            pool.query(
              `
              INSERT INTO player_event (player_id, sequence, event_list_id)
              SELECT p.id, ?, ?
              FROM player p
              WHERE p.name = ? AND p.coach_id = ? AND p.gender = ?
              ON DUPLICATE KEY UPDATE sequence = VALUES(sequence);
              `,
              [i + 1, eventListId, player, coachId, gender]
            )
          );
        }
      }
    }

    await Promise.all(insertPromises);

    return NextResponse.json({
      message: "Player events and vault skills saved successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
