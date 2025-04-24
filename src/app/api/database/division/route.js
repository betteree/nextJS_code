import pool from "@/lib/db"; // DB 연결 import 경로는 상황에 맞게 조정

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const divisionName = searchParams.get("division_name");

    if (!divisionName) {
      return new Response(
        JSON.stringify({ error: "division_name is required" }),
        {
          status: 400,
        }
      );
    }

    const query = `
      SELECT division_code 
      FROM division 
      WHERE division_name = ?
      LIMIT 1;
    `;

    const [rows] = await pool.query(query, [divisionName]);

    console.log(rows);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "No division found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ division_code: rows[0].division_code }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching division_code:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
