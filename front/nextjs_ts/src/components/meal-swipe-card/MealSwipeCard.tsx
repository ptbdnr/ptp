import React from "react";
import { motion } from "framer-motion";
import { Meal } from "@/types/meals";

import MealCard from "../meal-card/MealCard";


import styles from "./MealSwipeCard.module.css";

interface MealSwipeCardProps {
  meal: Meal;
  onSwipe?: (direction: "left" | "right") => void;
}

export default function MealSwipeCard({ meal, onSwipe }: MealSwipeCardProps) {
  const handleDragEnd = (event: MouseEvent | TouchEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      if (onSwipe) {
        onSwipe("right");
      }
    } else if (info.offset.x < -100) {
      if (onSwipe) {
        onSwipe("left");
      }
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.2 }}
      className={styles.card}
    >
      <MealCard meal={meal} display_details={true} display_tags={true} display_feedbackbuttons={true} />
    </motion.div>
  );
};
