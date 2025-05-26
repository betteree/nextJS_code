import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { List, ListItem, Typography, Box, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Image from "next/image";

interface Props {
  event: string;
  eventData: Record<string, string[]>;
  setEventData: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  handleRemoveFromEvent: (category: string, name: string) => void;
}

export default function DraggableList({
  event,
  eventData,
  setEventData,
  handleRemoveFromEvent,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이동해야 드래그 시작
      },
    })
  );

  const handleDragEnd = (eventDragEnd: DragEndEvent) => {
    const { active, over } = eventDragEnd;
    
    if (!over || active.id === over.id) return;
    
    if (active.id !== over?.id) {
      setEventData((prev) => {
        const oldIndex = prev[event].indexOf(String(active.id));
        const newIndex = prev[event].indexOf(String(over.id));
        return {
          ...prev,
          [event]: arrayMove(prev[event], oldIndex, newIndex),
        };
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={eventData[event] || []}
        strategy={verticalListSortingStrategy}
      >
        <List>
          <Typography sx={{borderBottom:"2px solid #F7F7F7" ,textAlign:"center",fontWeight:600,color:"#425065",pb:"8px"}}>Players: {eventData[event].length}</Typography>
          <Box sx={{p:2, display:"flex",flexFlow:"column",gap:1}}>
            {(eventData[event] || []).map((name) => (
              <SortableItem
                key={name}
                id={name}
                name={name}
                event={event}
                handleRemoveFromEvent={handleRemoveFromEvent}
              />
            ))}
          </Box>
        </List>
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemProps {
  id: string;
  name: string;
  event: string;
  handleRemoveFromEvent: (category: string, name: string) => void;
}

function SortableItem({
  id,
  name,
  event,
  handleRemoveFromEvent,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });


  return (
    <ListItem ref={setNodeRef}  sx={{
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    bgcolor: isDragging ? "#e0e0e0" : "#FAFAFA",
    borderRadius: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: isDragging ? 0.8 : 1,
  }} {...attributes} {...listeners}>
      <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
       
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
          {...listeners} // 드래그 핸들로 지정
          {...attributes}
        >
          <Image
            src="/icon/sequence.png"
            alt="drag handle"
            width={12}
            height={12}
            style={{ userSelect: "none", pointerEvents: "none" }}
          />
        </Box>
        {name}
      </Typography>
      <IconButton
        onClick={() => handleRemoveFromEvent(event, name)}
        size="small"
        color="error"
      >
        <CancelIcon color="info" />
      </IconButton>
    </ListItem>
  );
}
