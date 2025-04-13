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
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe && onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe && onSwipe("left");
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.1 }}
      className={styles.card}
    >
      <MealCard meal={meal} />
    </motion.div>
  );
};
