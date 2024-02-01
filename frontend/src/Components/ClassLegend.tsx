import { FaceClass } from "./Viewer";

export default function ClassLegend(props: { faceClassSelected?: FaceClass }) {
  const { faceClassSelected } = props;
  const classColors = {
    stock: "#000000", // Black
    rectangular_through_slot: "#FF0000", // Red
    chamfer: "#00FF00", // Green
    triangular_pocket: "#0000FF", // Blue
    "6_sides_passage": "#FFFF00", // Yellow
    slanted_through_step: "#FF00FF", // Magenta
    triangular_through_slot: "#00FFFF", // Cyan
    rectangular_blind_slot: "#800080", // Purple
    triangular_blind_step: "#4169E1", // Royal Blue
    rectangular_blind_step: "#808000", // Olive
    rectangular_passage: "#008080", // Teal
    "2_sides_through_step": "#800000", // Maroon
    "6_sides_pocket": "#808080", // Gray
    triangular_passage: "#FFA500", // Orange
    rectangular_pocket: "#A52A2A", // Brown
    rectangular_through_step: "#FFC0CB", // Pink
  };

  return (
    <div className="bg-transparent flex flex-col gap-y-2">
      {Object.entries(classColors).map(([className, color]) => (
        <div key={className} className="flex items-center">
          <div
            style={{
              width: faceClassSelected === className ? "60px" : "40px",
              height: faceClassSelected === className ? "30px" : "20px",
              paddingTop: faceClassSelected === className ? "10px" : undefined,
              paddingBottom:
                faceClassSelected === className ? "10px" : undefined,
              backgroundColor: color,
              opacity: 0.8,
              marginRight: "20px",
            }}
          />
          <span
            style={{
              fontSize: faceClassSelected === className ? "20px" : undefined,
            }}
          >
            {className.replace(/_/g, " ")}
          </span>
        </div>
      ))}
    </div>
  );
}
