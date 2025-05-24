// components/VaultDraggableList.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ListItem,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Image from "next/image";

interface VaultDraggableListProps {
  id: string;
  player_name: string;
  skill_number: string;
  onSkillChange: (value: string) => void;
  onDelete: () => void;
}

const VaultDraggableList: React.FC<VaultDraggableListProps> = ({
  id,
  player_name,
  skill_number,
  onSkillChange,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    backgroundColor: isDragging ? "#e0e0e0" : "#FAFAFA",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    marginBottom: "8px",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <ListItem ref={setNodeRef} style={style} >
      <Typography
        sx={{ display: "flex", alignItems: "center", gap: 1, width: "20%" }}
        {...attributes} {...listeners}
      >
        <Box component="span" sx={{ display: "flex", alignItems: "center" }} >
          <Image
            src="/icon/sequence.png"
            alt="drag handle"
            width={12}
            height={12}
          />
        </Box>
        {player_name}
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        value={skill_number}
        onChange={(e) => onSkillChange(e.target.value)}
        placeholder="기술 번호 입력"
        sx={{ bgcolor: "#fff" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Image
                src="/icon/write.png"
                alt="info"
                width={20}
                height={20}
                style={{ marginLeft: 4 }}
              />
            </InputAdornment>
          ),
        }}
      />
      <IconButton onClick={onDelete} size="small" color="info" sx={{ ml: "auto" }}>
        <CancelIcon />
      </IconButton>
    </ListItem>
  );
};

export default VaultDraggableList;
