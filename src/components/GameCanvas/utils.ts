import { Render } from "matter-js";

export const createRender = (
  scene: React.MutableRefObject<null>,
  currentEngine: Matter.Engine,
  canvasWidth: number,
  canvasHeight: number
) => {
  if (!scene.current) return;
  const render = Render.create({
    element: scene.current,
    engine: currentEngine,
    options: {
      width: canvasWidth,
      height: canvasHeight,
      wireframes: false,
      showVelocity: false,
      background: "transparent",
      hasBounds: true,
    },
  });
  return render;
};
