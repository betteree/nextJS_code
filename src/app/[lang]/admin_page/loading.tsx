
import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <ClipLoader size={50} color="#36d7b7" />
    </div>
  );
}
