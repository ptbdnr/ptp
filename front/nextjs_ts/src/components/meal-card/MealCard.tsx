import { Meal } from '@/types/meals';

import { X, Check } from 'lucide-react';

import styles from './MealCard.module.css';

type MealCardProps = {
  meal: Meal;
  display_details?: boolean,
  display_tags?: boolean;
  display_feedbackbuttons?: boolean;
};

export default function MealCard({ 
  meal: meal, 
  display_details = false, 
  display_tags = false, 
  display_feedbackbuttons = false 
}: MealCardProps) {
  const difficulty = 'medium'; // ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
  const price = 18; // 3 + Math.floor(Math.random() * 18) + [0.0, 0.50, 0.75][Math.floor(Math.random() * 3)];
  const prepTime = 30; // 10 + Math.floor(Math.random() * 60);

  return (
    <div className={styles.card}>
      
      { display_tags && 
      <div className={styles.aiTag}>
        <span className={styles.aiDot}></span>
        AI Created
      </div>
      }
      
      <div className={styles.mealImage} style={{ fontSize: '150px', lineHeight: '150px', textAlign: 'center' }}>
        {meal.images.thumbnail_url}
        
        {display_feedbackbuttons &&
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionButton} ${styles.dislikeButton}`}
            aria-label="Dislike meal"
          >
            <X size={24} />
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.likeButton}`}
            aria-label="Like meal"
          >
            <Check size={24} />
          </button>
        </div>
        }
      </div>
      
      <div className={styles.mealInfo}>
        <h2 className={styles.mealName}>{meal.name}</h2>
        
        { display_details && 
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
        }
        
      </div>
    </div>
  );
}