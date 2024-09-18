import { useEffect, useRef } from "react";
import handReleasingSvg from "../../assets/images/handReleasing.svg";
import handReleasingSvg2 from "../../assets/images/handReleasing2.svg";
import { useAppSize } from "../../hooks/useAppSize";
import {
  SODA_BOX_HEIGHT,
  SODA_BOX_WIDTH,
  HAND_Y_POSITION,
  MAX_SPEED,
  SODA_Y_POSITION,
  SPEED,
  TIME_DELAY,
} from "./constants";
import { createHand, createSodaBox } from "./bodies";
import { Body, Composite } from "matter-js";
import { getSodaBoxList } from "../../utils/functions";

export const useSodaBoxAnimation = (
  scrollPosition: React.MutableRefObject<number>,
  world: Matter.World,
  engine: Matter.Engine
) => {
  const { appHeight: canvasHeight, appWidth: canvasWidth } = useAppSize();
  let blockMovingInterval: NodeJS.Timeout;
  const speedRef = useRef(SPEED);
  const buttonBusyRef = useRef<boolean>(false);

  const hand = useRef<Matter.Body>(
    createHand(
      canvasWidth / 4,
      scrollPosition.current,
      canvasHeight,
      HAND_Y_POSITION
    )
  );
  const sodaBox = useRef<Matter.Body>(
    createSodaBox(
      canvasWidth / 4,
      scrollPosition.current,
      canvasHeight,
      SODA_BOX_HEIGHT,
      SODA_BOX_WIDTH,
      SODA_Y_POSITION
    )
  );

  const removeHand = (
    scrollPosition: React.MutableRefObject<number>,
    canvasHeight: number
  ) => {
    if (hand.current.render.sprite != undefined) {
      hand.current.render.sprite.texture = handReleasingSvg2;
      setTimeout(() => {
        hand.current.render.sprite!.texture = handReleasingSvg;
      }, 150);
    }

    const startYHand = hand.current.position.y;
    const targetYHand = scrollPosition.current - canvasHeight - 280;
    const duration = 300;

    let startTime: number;

    const animateDisappearance = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const progress = Math.min(elapsed / duration, 1);
      const currentYHand = startYHand + (targetYHand - startYHand) * progress;
      hand.current.position.y = currentYHand;

      if (progress < 1) {
        requestAnimationFrame(animateDisappearance);
      } else {
        completeDisappearance();
      }
    };

    const completeDisappearance = () => {
      hand.current.position.y = targetYHand;
    };

    requestAnimationFrame(animateDisappearance);
  };
  const newHandWithSoda = (scrollPosition: React.MutableRefObject<number>) => {
    const targetYHand = scrollPosition.current - canvasHeight + HAND_Y_POSITION;
    const targetYSoda = scrollPosition.current - canvasHeight + SODA_Y_POSITION;
    const startYHand = targetYHand - 200;
    const startYSoda = targetYSoda - 200;
    const duration = TIME_DELAY;

    let startTime: number;

    const animateAppearance = (timestamp: number) => {
      if (!startTime) {
        hand.current.render.visible = true;
        sodaBox.current.render.visible = true;
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;

      const progress = Math.min(elapsed / duration, 1);
      const currentYHand = startYHand + (targetYHand - startYHand) * progress;
      const currentYSoda = startYSoda + (targetYSoda - startYSoda) * progress;
      sodaBox.current.position.y = currentYSoda;
      hand.current.position.y = currentYHand;

      if (progress < 1) {
        requestAnimationFrame(animateAppearance);
      } else {
        sodaBox.current.position.y = targetYSoda;
        hand.current.position.y = targetYHand;
        if (speedRef.current < MAX_SPEED) speedRef.current += 0.1;
        startBlockMovement();
        glueOldBlocksTogether();
        buttonBusyRef.current = false;
      }
    };
    requestAnimationFrame(animateAppearance);
  };

  const glueOldBlocksTogether = () => {
    const blocks = getSodaBoxList(engine);
    if (blocks.length > 5) {
      Body.setStatic(blocks[blocks.length - 6], true);
    }
  };

  const startBlockMovement = () => {
    let direction = 1; // 1 for right, -1 for left
    blockMovingInterval = setInterval(function () {
      // Move the block
      Body.translate(sodaBox.current, {
        x: direction * speedRef.current,
        y: 0,
      });
      Body.translate(hand.current, { x: direction * speedRef.current, y: 0 });

      // Reverse direction at the edges
      if (sodaBox.current.position.x > canvasWidth - canvasWidth / 6)
        direction = -1;
      if (sodaBox.current.position.x < 0 + canvasWidth / 6) direction = 1;
    }, 16); // roughly 60fps
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      if (buttonBusyRef.current) return;
      buttonBusyRef.current = true;
      Body.setStatic(sodaBox.current, false);
      removeHand(scrollPosition, canvasHeight);
      if (blockMovingInterval) clearInterval(blockMovingInterval);

      const timeout = setTimeout(() => {
        Composite.remove(world, hand.current);
        hand.current = createHand(
          canvasWidth / 3,
          scrollPosition.current,
          canvasHeight,
          HAND_Y_POSITION,
          false
        );
        sodaBox.current = createSodaBox(
          canvasWidth / 3,
          scrollPosition.current,
          canvasHeight,
          SODA_BOX_HEIGHT,
          SODA_BOX_WIDTH,
          SODA_Y_POSITION,
          false
        );

        hand.current.position.y = -200;
        sodaBox.current.position.y = -200;

        Composite.add(world, hand.current);
        Composite.add(world, sodaBox.current);

        newHandWithSoda(scrollPosition);
      }, TIME_DELAY);
      return () => clearTimeout(timeout);
    }
  };

  useEffect(() => {
    Composite.add(world, sodaBox.current);
    Composite.add(world, hand.current);

    startBlockMovement();
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(blockMovingInterval);
    };
  }, []);
  return { hand };
};
