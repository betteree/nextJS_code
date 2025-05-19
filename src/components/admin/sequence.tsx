"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coach, Contest } from "@/types/result";
import { getClassdata } from "../data/classData";
import { RotateLoader } from "react-spinners";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function Sequence({lang}:{lang:string}) {
  const [contestData, setContestData] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 필터링
  const filteredData = contestData
    .map((contest) => {
      const filteredCoaches = contest.coaches.filter((coach) => {
        const search = searchTerm.toLowerCase();
        return (
          coach.name.toLowerCase().includes(search) ||
          coach.affiliation.toLowerCase().includes(search) ||
          contest.title.toLowerCase().includes(search)
        );
      });

      if (filteredCoaches.length > 0) {
        return {
          ...contest,
          coaches: filteredCoaches,
        };
      }
      return null;
    })
    .filter((contest) => contest !== null);

  // 대회 데이터 받아오기
  useEffect(() => {
    setLoading(true);
    fetch("/api/database/sequence")
      .then((res) => res.json())
      .then((data) => {
        setContestData(data);
        setLoading(false);
      });
  }, []);

  // 정보 저장 후 결과 페이지로 이동
  const handleInfo = ({
    contest,
    coach,
  }: {
    contest: Contest;
    coach: Coach;
  }) => {
    localStorage.setItem("coach", coach.coach_competition_id);
    localStorage.setItem("competitionId", contest.id);
    localStorage.setItem("selectedCompetition", contest.title);
    localStorage.setItem("userId", coach.coach_id);
    router.push(`/${lang}/result_page`);
  };

  // 대회 데이터 전송
  const handleSend = async (competitionId: string) => {
    try {
      const res = await fetch(
        `/api/database/sequence/result?competition_id=${competitionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "전송 실패");
      }

      getClassdata(data, competitionId);
    } catch (err) {
      console.error(err);
      alert("전송 중 오류가 발생했어요!");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%"}}>
      <Box sx={{ padding: "20px", display: "flex", gap: "20px" }}>
        <Typography variant="h5">선수 순서 LIST</Typography>
        <TextField
          variant="outlined"
          label="지도자,대회,학교 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
            width: "100%",
          }}
        >
          <RotateLoader size={10} color="#1E90FF" />
        </Box>
      ) : contestData.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          등록된 대회가 없습니다.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ margin: "20px" ,width: "auto",}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>대회명</TableCell>
                <TableCell>#</TableCell>
                <TableCell>지도자</TableCell>
                <TableCell>학교명</TableCell>
                <TableCell>전화번호</TableCell>
                <TableCell>순서</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((contest, contestIndex) =>
                contest.coaches.map((coach, coachIndex) => (
                  <TableRow key={`${contestIndex}-${coachIndex}`}>
                    {coachIndex === 0 && (
                      <TableCell rowSpan={contest.coaches.length}>
                        {contest.title}
                        <Button
                          variant="contained"
                          onClick={() => handleSend(contest.id)}
                          sx={{ marginTop: "10px" }}
                        >
                          전송
                        </Button>
                      </TableCell>
                    )}
                    <TableCell>{coachIndex + 1}</TableCell>
                    <TableCell>{coach.name}</TableCell>
                    <TableCell>{coach.affiliation}</TableCell>
                    <TableCell>{coach.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleInfo({ contest, coach })}
                      >
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
