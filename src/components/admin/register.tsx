"use client";

import { RegisterProps } from "@/types/player";
import { Box, Button, FormControl, FormControlLabel, Checkbox, InputLabel, MenuItem, Select, TextField } from "@mui/material";

export default function Register({ itemData, isClose }: RegisterProps) {
  const organization = ["대한체조협회", "체조협회", "고등체조협회"];
  const checkedGender = itemData?.gender?.split(",") || [];

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id?: number
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const requestData = {
      id: id || undefined,
      title: formData.get("title") as string,
      start_date: formData.get("startday") as string,
      end_date: formData.get("endday") as string,
      location: formData.get("place") as string,
      organizer: formData.get("host") as string,
      gender: formData.getAll("gender").join(","),
    };

    const method = id ? "PUT" : "POST";
    const url = "/api/database/admin";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    if (result.success) {
      alert(id ? "수정 완료!" : "등록 완료!");
      window.location.reload();
    } else {
      alert(`${id ? "수정" : "등록"} 실패: ${result.error}`);
    }
  };

  return (
    <Box sx={{ position: "absolute",right: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <Box sx={{ backgroundColor: "white", padding: 5, width: "60%", margin: "auto", display: "flex", flexDirection: "column", gap: 2 ,mt:20}}>
        <form onSubmit={(e) => handleSubmit(e, itemData?.id)} style={{padding:"20px"}}>
          <TextField
            label="대회명"
            name="title"
            defaultValue={itemData ? itemData.title : ""}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="시작 날짜"
            name="startday"
            type="date"
            defaultValue={itemData && itemData.start_date ? itemData.start_date.split("T")[0] : ""}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="종료 날짜"
            name="endday"
            type="date"
            defaultValue={itemData && itemData.end_date ? itemData.end_date.split("T")[0] : ""}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="장소"
            name="place"
            defaultValue={itemData ? itemData.location : ""}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>주관</InputLabel>
            <Select name="host" defaultValue={itemData ? itemData.organizer : ""}>
              <MenuItem value="">기관선택</MenuItem>
              {organization.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="gender"
                  value="남"
                  defaultChecked={checkedGender.includes("남")}
                />
              }
              label="남자"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="gender"
                  value="여"
                  defaultChecked={checkedGender.includes("여")}
                />
              }
              label="여자"
            />
          </Box>
          <Box sx={{display:"flex", gap:2}}>
             <Button variant="outlined" color="secondary" onClick={() => isClose(null)} fullWidth>
            닫기
           </Button>
            <Button variant="contained" type="submit" fullWidth sx={{background: 'linear-gradient(90deg, #0200BA 0%, #6103B0 100%)'}}>
              {itemData === null ? "등록" : "수정"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
