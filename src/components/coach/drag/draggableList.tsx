import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "@/styles/coachBoard.module.css";
import { DraggableProps } from "@/types/player";

export default function DraggableList({ id, onDelete }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      className={styles.item}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span>{id}</span>
      <button className={styles.deleteButton} onClick={onDelete}>
        <img src="/icon/cancel.png" alt="삭제" />
      </button>
    </li>
  );
}
