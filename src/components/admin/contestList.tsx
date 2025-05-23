"use client";

import { useState, useEffect } from "react";
import { Admin } from "@/types/player";
import { RotateLoader } from "react-spinners";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
    Paper,
} from "@mui/material";
import Register from "@/components/admin/register";
import CreateIcon from '@mui/icons-material/Edit'

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
    <>
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%",p:8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
        <Typography variant="h5" fontWeight={500}>📃 대회 LIST</Typography>
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
        <TableContainer component={Paper} sx={{ margin: "20px" ,width: "auto"}}>
          <Table>
            <TableHead sx={{bgcolor:"info.light", "& .MuiTableCell-root": { color: "white" }}}>
              <TableRow >
                <TableCell>#</TableCell>
                <TableCell>대회명</TableCell>
                <TableCell>대회기간</TableCell>
                <TableCell>장소</TableCell>
                <TableCell>주관</TableCell>
                <TableCell>성별</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((item, index) => (
                <TableRow key={index} sx={{}}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.start_date} ~ {item.end_date}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.organizer}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleModal(item)}>
                        <CreateIcon/>
                      </Button>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    {isOpen && <Register itemData={itemData} isClose={handleModal} />}
  
  </>
    );
}
