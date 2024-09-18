import { useEffect } from "react";
import { useAppSize } from "../../hooks/useAppSize";
import { useSodaBoxAnimation } from "./useSodaBoxAnimation";

export const useGameLogic = (
  currentEngine: Matter.Engine,
  world: Matter.World,
  scrollPosition: React.MutableRefObject<number>,
  blockFalling: React.MutableRefObject<boolean>
) => {
  const { appHeight: canvasHeight, appWidth: canvasWidth } = useAppSize();
  useSodaBoxAnimation(scrollPosition, world, currentEngine);

  const handleButtonPress = () => {
    blockFalling.current = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      handleButtonPress();
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [canvasWidth, canvasHeight]);
};
