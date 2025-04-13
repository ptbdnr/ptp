import React from "react";
import { motion } from "framer-motion";


interface MealSwipeCardProps {
  content: string;
  onSwipe: (direction: "left" | "right") => void;
}

const MealSwipeCard: React.FC<MealSwipeCardProps> = ({ content, onSwipe }) => {
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="w-64 h-96 bg-white shadow-lg rounded-lg flex items-center justify-center"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.1 }}
    >
      {content}
    </motion.div>
  );
};

export default MealSwipeCard;
