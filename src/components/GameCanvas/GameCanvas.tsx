import Matter, { Composite, Engine, Render, World } from "matter-js";
import { useEffect, useRef } from "react";
import { GamePageContainer } from "./styles";
import { useGameLogic } from "./useGameLogic";
import { useAppSize } from "../../hooks/useAppSize";
import { GROUND_HEIGHT } from "./constants";
import { createGround } from "./bodies";
import { createRender } from "./utils";

export const GameCanvas = () => {
  const { Runner } = Matter;
  const scene = useRef(null);
  // Create an engine.
  const engine = useRef(Engine.create({ gravity: { scale: 0.0009 } })); // default: 0.001
  const currentEngine = engine.current;
  const world = currentEngine.world;
  const renderRef = useRef<Render | null>(null);
  const blockFalling = useRef(false);
  const { appWidth: canvasWidth, appHeight: canvasHeight } = useAppSize();
  const scrollPosition = useRef(canvasHeight);

  useEffect(() => {
    // Create a renderer
    const render = createRender(
      scene,
      currentEngine,
      canvasWidth,
      canvasHeight
    );
    if (!scene.current || !render) return;
    renderRef.current = render;

    // Add ground to world
    Composite.add(world, [
      createGround(canvasWidth, canvasHeight, GROUND_HEIGHT),
    ]);

    // Create runner
    const runner = Runner.create();
    // Run the engine
    Runner.run(runner, currentEngine);
    // Run the renderer
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(currentEngine);
      render.canvas.remove();
    };
  }, [canvasHeight, canvasWidth, currentEngine]);

  useGameLogic(currentEngine, world, scrollPosition, blockFalling);

  return (
    <GamePageContainer>
      <div ref={scene} />
    </GamePageContainer>
  );
};
