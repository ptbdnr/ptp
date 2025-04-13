import { Meal } from '@/types/meals';

import styles from './MealCard.module.css';

type MealCardProps = {
  meal: Meal;
};

export default function MealCard({ meal: meal }: MealCardProps) {
  const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
  const price = 3 + Math.floor(Math.random() * 18) + [0.0, 0.50, 0.75][Math.floor(Math.random() * 3)];
  const prepTime = 10 + Math.floor(Math.random() * 60);

  return (
    <div className={styles.card}>
      <div className={styles.aiTag}>
        <span className={styles.aiDot}></span>
        AI Created
      </div>
      
      <div className={styles.mealImage} style={{ fontSize: '150px', lineHeight: '150px', textAlign: 'center' }}>
        {meal.images.thumbnail_url}
      </div>
      
      <div className={styles.mealInfo}>
        <h2 className={styles.mealName}>{meal.name}</h2>
        
        <div className={styles.mealDetails}>
          <div className={styles.prepTime}>
            <span className={styles.value}>{prepTime}</span>
            <span className={styles.unit}>min</span>
          </div>
          
          <div className={styles.difficulty}>
            {difficulty}
          </div>
          
          <div className={styles.price}>
            £{price}
          </div>
        </div>
        
      </div>
    </div>
  );
}