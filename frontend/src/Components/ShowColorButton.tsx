import { useState } from "react";
import Button from "./Buttons";
import { FaceClass } from "./Viewer";

export const useShowColorButton = () => {
  const [showColor, setShowColor] = useState(false);
  const [faceClassSelected, setFaceClassSelected] = useState<FaceClass>();
  const showColorButton = () => ShowColorButton({ showColor, setShowColor });
  return {
    showColorButton,
    showColor,
    setShowColor,
    faceClassSelected,
    setFaceClassSelected,
  };
};

const ShowColorButton = (props: {
  showColor: boolean;
  setShowColor: (show: boolean) => void;
}) => {
  const { showColor, setShowColor } = props;
  const handleClick = () => {
    setShowColor(!showColor);
  };
  return (
    <Button height="60px" width="180px" onClick={handleClick}>
      {!showColor ? "Show Features": "Hide Features"}
    </Button>
  );
};
