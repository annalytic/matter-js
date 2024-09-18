import { Bodies } from "matter-js";
import hand from "../../assets/images/hand.svg";
import { SVG_SCALING } from "./constants";

export const createSodaBox = (
  xPosition: number,
  scrollPosition: number,
  viewportHeight: number,
  blockHeight: number,
  blockWidth: number,
  sodaYStopAnimation: number,
  visible: boolean = true
) => {
  const yPosition = scrollPosition - viewportHeight + sodaYStopAnimation;
  return Bodies.rectangle(xPosition, yPosition, blockWidth, blockHeight, {
    isStatic: true,
    label: "sodaBox",
    render: {
      visible: visible,
      fillStyle: "red",
    },
  });
};

export const createHand = (
  xPosition: number,
  scrollPosition: number,
  viewportHeight: number,
  handYStopAnimation: number,
  visible: boolean = true
) => {
  const yPosition = scrollPosition - viewportHeight + handYStopAnimation;
  return Bodies.rectangle(xPosition, yPosition, 1, 1, {
    isStatic: true,
    label: "hand",
    render: {
      sprite: {
        texture: hand,
        xScale: SVG_SCALING,
        yScale: SVG_SCALING,
      },
      visible: visible,
    },
  });
};

export const createGround = (
  canvasWidth: number,
  canvasHeight: number,
  groundHeight: number
) => {
  return Bodies.rectangle(
    canvasWidth / 2,
    canvasHeight,
    canvasWidth * 2,
    groundHeight,
    {
      isStatic: true,
      label: "ground",
      render: {
        fillStyle: "transparent",
      },
    }
  );
};
