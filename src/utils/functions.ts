import { Engine } from "matter-js";

export const getSodaBoxList = (engine: Engine): Matter.Body[] => {
  return engine.world.bodies.filter((body) => body.label === "sodaBox");
};
