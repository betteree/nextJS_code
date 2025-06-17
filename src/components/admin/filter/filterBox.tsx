// components/FilterBar.tsx

import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Filters,FilterBarProps } from "@/types/result";

const FilterBar: React.FC<FilterBarProps> = ({ data, filters, setFilters }) => {
  const handleChange = (key: keyof Filters) => (e: SelectChangeEvent) => {
    setFilters({ ...filters, [key]: e.target.value });
  };
  const contestTitles = Array.from(new Set(data.map((contest) => contest.title)));
  const schoolNames = Array.from(
    new Set(data.flatMap((c) => c.coaches.map((coach) => coach.affiliation || "미정")))
  );

  return (
    <Box display="flex" gap={2} mb={2} pl={2.5}>

      <FormControl sx={{ minWidth: 150}}>
        <InputLabel>대회</InputLabel>
        <Select
          value={filters.contest}
          label="대회"
          onChange={handleChange("contest")}
          MenuProps={{
                PaperProps: {
              sx: {
               maxHeight: 200,  overflowY: "auto",
            }
         }
          }}
        >
          <MenuItem value="">전체</MenuItem>
          {contestTitles.map((title) => (
            <MenuItem key={title} value={title}>
              {title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>소속</InputLabel>
        <Select
          value={filters.school}
          label="학교"
          onChange={handleChange("school")}
          MenuProps={{
                PaperProps: {
              sx: {
               maxHeight: 300,  overflowY: "auto",
            }
         }
          }}
        >
          <MenuItem value="">전체</MenuItem>
          {schoolNames.map((school) => (
            <MenuItem key={school} value={school}>
              {school}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
