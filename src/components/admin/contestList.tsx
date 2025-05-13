"use client";

import { useState, useEffect } from "react";
import { Admin } from "@/types/player";
import { RotateLoader } from "react-spinners";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import Register from "@/components/admin/register";
import { styled } from "@mui/system";

const StyledTable = styled(Table)({
  margin: "20px",
  border: "3px solid rgb(234, 234, 234)",
  "& thead": {
    background: "rgb(241, 241, 241)",
    color: "gray",
  },
  "& th, td": {
    padding: "10px",
    textAlign: "left",
  },
  "& tr": {
    borderBottom: "2px solid rgb(234, 234, 234)",
  },
});

export default function ContestList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [itemData, setItemData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/database/admin?table=${"competition"}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admins:", err);
        setLoading(false);
      });
  }, []);

  const handleModal = (item: Admin | null) => {
    setIsOpen((prev) => !prev);
    setItemData(item);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
        <Typography variant="h5">대회 LIST</Typography>
        <Button variant="contained" onClick={() => handleModal(null)}>
          대회 추가
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 4 }}>
          <RotateLoader size={10} color="#1E90FF" />
        </Box>
      ) : admins.length === 0 ? (
        <Typography sx={{ textAlign: "center", marginTop: 4 }}>등록된 대회가 없습니다.</Typography>
      ) : (
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>대회명</TableCell>
                <TableCell>대회시작</TableCell>
                <TableCell>대회종료</TableCell>
                <TableCell>장소</TableCell>
                <TableCell>주관</TableCell>
                <TableCell>성별</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.start_date}</TableCell>
                  <TableCell>{item.end_date}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.organizer}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleModal(item)}>
                      수정
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      )}
      {isOpen && <Register itemData={itemData} isClose={handleModal} />}
    </Box>
  );
}
