// src/hooks/useDragAndDrop.ts
import { useState } from "react";

export function useDragAndDrop<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);

  const handleDragStart = (index: number, category: string) => {
    setDraggedIndex(index);
    setDraggedCategory(category);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // ✅ 기존 동작 방지 (드롭 가능하도록 설정)
  };

  const handleDrop = (index: number, category: string) => {
    if (draggedIndex === null || draggedCategory !== category) return;

    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, removed);
      return newItems;
    });

    setDraggedIndex(null);
    setDraggedCategory(null);
  };

  return {
    items,
    setItems,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
