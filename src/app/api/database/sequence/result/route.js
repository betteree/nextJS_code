import { NextResponse } from "next/server";
import db from "@/lib/db"; // DB 커넥션 풀 (설정에 따라 경로 조정 필요)

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const competitionId = searchParams.get("competition_id");

  // competition_id가 없으면 에러 응답
  if (!competitionId) {
    return NextResponse.json(
      { error: "competition_id is required" },
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
         vs.skill_number,
         c.affiliation AS coach_affiliation 
        FROM event_list e
        JOIN player_event pe ON e.id = pe.event_list_id
        JOIN player p ON pe.player_id = p.id
        LEFT JOIN vault_skills vs ON pe.id = vs.player_event_id
        JOIN coach_competition cc ON p.coach_id = cc.id -- coach_competition 테이블을 join
        JOIN coach c ON cc.coach_id = c.id -- coach 테이블을 join하여 affiliation을 가져옵니다.
        WHERE cc.competition_id = ? -- competition_id에 해당하는 코치들만 필터링
        ORDER BY e.id, pe.sequence;
    `;

    const [rows] = await db.query(query, [competitionId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("쿼리 실행 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const {
      CLASS_CD,
      CLASS_SUB_CD,
      COMP_CD,
      BASE_CLASS_CD,
      DETAIL_CLASS_NM,
      TO_CD,
      SEX_CD,
      KIND_NM,
      KIND_CD,
      DETAIL_CLASS_CD,
      SEX_ORDER,
      ID_NO,
      GROUP_CD,
      ENTRANT_SEQ,
      R1_VAULT_ID,
      R1_VAULT_VALUE,
      R2_VAULT_ID,
      R2_VAULT_VALUE,
      R2_VAULT_YN,
      ROTATION_SEQ,
    } = await req.json();

    // lp_class 테이블에 데이터 삽입 (중복된 경우 건너뛰기)
    const [existingClass] = await db.query(
      "SELECT 1 FROM lp_class WHERE CLASS_CD = ? AND CLASS_SUB_CD = ? AND BASE_CLASS_CD = ? AND TO_CD = ? AND KIND_CD = ? AND DETAIL_CLASS_CD = ?",
      [CLASS_CD, CLASS_SUB_CD, BASE_CLASS_CD, TO_CD, KIND_CD, DETAIL_CLASS_CD]
    );

    if (existingClass.length > 0) {
      console.log(
        `${DETAIL_CLASS_CD} 이미 존재하여 lp_class 삽입을 건너뜁니다.`
      );
    } else {
      // lp_class에 데이터 삽입
      await db.query(
        "INSERT INTO lp_class (CLASS_CD, CLASS_SUB_CD, BASE_CLASS_CD, TO_CD, KIND_CD, DETAIL_CLASS_CD, KIND_NM, DETAIL_CLASS_NM, SEX_CD, SEX_ORDER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          CLASS_CD,
          CLASS_SUB_CD,
          BASE_CLASS_CD,
          TO_CD,
          KIND_CD,
          DETAIL_CLASS_CD,
          KIND_NM,
          DETAIL_CLASS_NM,
          SEX_CD,
          SEX_ORDER,
        ]
      );
    }

    // lp_order 테이블에 데이터 삽입 (lp_class와 관계없이 삽입)
    await db.query(
      "INSERT INTO lp_order (CLASS_CD, CLASS_SUB_CD, TO_CD, DETAIL_CLASS_CD, COMP_CD, GROUP_CD, ID_NO, ENTRANT_SEQ, R1_VAULT_ID, R1_VAULT_VALUE, R2_VAULT_ID, R2_VAULT_VALUE, R2_VAULT_YN, ROTATION_SEQ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        CLASS_CD,
        CLASS_SUB_CD,
        TO_CD,
        DETAIL_CLASS_CD,
        COMP_CD,
        GROUP_CD,
        ID_NO,
        ENTRANT_SEQ,
        R1_VAULT_ID,
        R1_VAULT_VALUE,
        R2_VAULT_ID,
        R2_VAULT_VALUE,
        R2_VAULT_YN,
        ROTATION_SEQ,
      ]
    );

    // 성공적으로 삽입된 경우
    return NextResponse.json({
      success: true,
      message: `${DETAIL_CLASS_CD} 데이터 삽입 완료!`,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
