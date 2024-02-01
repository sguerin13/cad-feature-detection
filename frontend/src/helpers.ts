import {FaceClass} from "./Components/Viewer"

export function convertClassToColor(faceClass: FaceClass): string {
    switch (faceClass) {
        case "stock":
            return "#000000"; // Black
        case "rectangular_through_slot":
            return "#FF0000"; // Red
        case "chamfer":
            return "#00FF00"; // Green
        case "triangular_pocket":
            return "#0000FF"; // Blue
        case "6sides_passage":
            return "#FFFF00"; // Yellow
        case "slanted_through_step":
            return "#FF00FF"; // Magenta
        case "triangular_through_slot":
            return "#00FFFF"; // Cyan
        case "rectangular_blind_slot":
            return "#800080"; // Purple
        case "triangular_blind_step":
            return "#4169E1"; // Royal Blue
        case "rectangular_blind_step":
            return "#808000"; // Olive
        case "rectangular_passage":
            return "#008080"; // Teal
        case "2sides_through_step":
            return "#800000"; // Maroon
        case "6sides_pocket":
            return "#808080"; // Gray
        case "triangular_passage":
            return "#FFA500"; // Orange
        case "rectangular_pocket":
            return "#A52A2A"; // Brown
        case "rectangular_through_step":
            return "#FFC0CB"; // Pink
        default:
            throw new Error(`Invalid face class: ${faceClass}`);
    }
}


