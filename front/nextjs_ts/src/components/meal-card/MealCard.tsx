import { Meal } from '@/types/meals';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import styles from './MealCard.module.css';

type MealCardProps = {  
  meal: Meal;
  card_size?: 'small' | 'normal';
  display_details?: boolean,
  display_tags?: {
    display_stocktag?: boolean,
    display_searchtag?: boolean,
    display_aitag?: boolean,
    display_suprisetag?: boolean
  },
  display_feedbackbuttons?: boolean;
};

export default function MealCard({ 
  meal: meal, 
  card_size = 'normal',
  display_details = false, 
  display_tags: {
    display_stocktag = false,
    display_searchtag = false,
    display_aitag = false,
    display_suprisetag = false
  } = {
    display_stocktag: false,
    display_searchtag: false,
    display_aitag: false,
    display_suprisetag: false
  },
  display_feedbackbuttons = false 
}: MealCardProps) {
  const difficulty = 'medium'; // ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
  const price = 18; // 3 + Math.floor(Math.random() * 18) + [0.0, 0.50, 0.75][Math.floor(Math.random() * 3)];
  const prepTime = 30; // 10 + Math.floor(Math.random() * 60);

  return (
    <div className={styles.card + ' ' + styles[card_size]}>
      
      { display_stocktag &&
      <div className={`${styles.tag} ${styles.stockTag}`}>
        <span className={styles.tagDot}></span>
        Stock Meal
      </div>
      }
      { display_searchtag &&
      <div className={`${styles.tag} ${styles.searchTag}`}>
        <span className={styles.tagDot}></span>
        Search Result
      </div>
      }
      { display_aitag && 
      <div className={`${styles.tag} ${styles.aiTag}`}>
        <span className={styles.tagDot}></span>
        AI Created
      </div>
      }
      { display_suprisetag &&
      <div className={`${styles.tag} ${styles.surpriseTag}`}>
        <span className={styles.tagDot}></span>
        Surprise Meal
      </div>
      }
      
      <div className={styles.mealImage} style={{ fontSize: '150px', lineHeight: '150px', textAlign: 'center' }}>
        {meal.images.placeholder_emoji}
        
        {display_feedbackbuttons &&
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionButton} ${styles.dislikeButton}`}
            aria-label="Dislike meal"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.likeButton}`}
            aria-label="Like meal"
          >
            <ChevronRight size={24} />
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