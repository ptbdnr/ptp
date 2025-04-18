'use client';

import { useState } from 'react';
import { Meal } from '@/types/meals';
import { Ingredient } from '@/types/ingredients';

import ReactMarkdown from 'react-markdown';
import MealDetailsHero from './MealDetailsHero';
import { Bookmark, ShoppingCart, Star, WandSparkles } from 'lucide-react';

import styles from './MealDetails.module.css';

interface MealDetailsProps {
  meal: Meal;
}

export default function MealDetails({ meal }: MealDetailsProps) {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const servings = 4;
  const prepTime = 30;
  const difficulty = 'Med'
  const price = 8.50

  // Determine which ingredients the user has/doesn't have
  const userHasIngredient = (ingredient: Ingredient): boolean => {
    if (meal.ingredients) {
      return !ingredient.name.includes(meal.ingredients.ingredients[0].name);
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* Meal Hero Image */}
        <div className={styles.heroContainer}>
          <MealDetailsHero meal={meal} />
          <div className={styles.heroContent}>
            <h1 className={styles.mealTitle}>{meal.name}</h1>
            <p className={styles.mealDescription}>{meal.description}</p>
          </div>
        </div>
        
        {/* Meal Stats */}
        <div className={styles.mealStats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⏱️</span>
            <span className={styles.statValue}>{prepTime}</span>
            <span className={styles.statLabel}>min</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>👥</span>
            <span className={styles.statValue}>{servings}</span>
            <span className={styles.statLabel}>serv</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⭐</span>
            <span className={styles.statValue}>{difficulty}</span>
            <span className={styles.statLabel}>difficulty</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>💰</span>
            <span className={styles.statValue}>£{price}</span>
            <span className={styles.statLabel}>total</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🔥</span>
            <span className={styles.statValue}>420</span>
            <span className={styles.statLabel}>calories</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className={styles.tabs}>
        { meal.ingredients &&
        <button 
          className={`${styles.tab} ${activeTab === 'ingredients' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ingredients
        </button>
        }
        { meal.instructions &&
        <button 
          className={`${styles.tab} ${activeTab === 'instructions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('instructions')}
        >
          Instructions
        </button>
        }
      </div>
      
      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'ingredients' && meal.ingredients && (
          <div className={styles.ingredientsContainer}>
            <div className={styles.ingredientsHeader}>
              <span>{meal.ingredients.ingredients.length} ingredients</span>
              {/* <button className={styles.adjustButton}>Adjust</button> */}
            </div>
            <ul className={styles.ingredientsList}>
              {meal.ingredients.ingredients.map((ingredient) => (
                <li 
                  key={ingredient.id} 
                  className={`${styles.ingredientItem} ${userHasIngredient(ingredient) ? styles.hasIngredient : styles.missingIngredient}`}
                >
                  <div className={styles.IngredientDetails}>
                    <span className={styles.ingredientCheck}>
                      {userHasIngredient(ingredient) ? '✓' : '✕'}
                    </span>
                    <span className={styles.ingredientName}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </span>
                  </div>
                  <div className={styles.ingredientActions}>
                  {!userHasIngredient(ingredient) && 
                    <button 
                      disabled
                    >
                      <ShoppingCart className={styles.actionIcon} />
                    </button>
                  }
                    <button>
                      <WandSparkles className={styles.actionIcon} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'instructions' && (
          <div className={styles.instructionsContainer}>
            {meal.videos?.hero_url &&
            <video 
                width="100%" 
                height="100%" 
                controls 
                autoPlay 
                preload="auto"
                src={meal.videos?.hero_url || "/placeholder_meal-hero_16x4.mp4"}
                playsInline
              />
            }
            <ReactMarkdown>
              {meal.instructions}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          className={styles.actionButton}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark className={styles.icon} fill={isBookmarked ? '#fc3b00' : 'transparent'} /> <span>Save</span>
        </button>
        <button 
          className={styles.actionButton}
          onClick={() => setIsRated(!isRated)}
        >
          <Star className={styles.icon} fill={isRated ? 'yellow' : 'transparent'}/> <span>Rate</span>
        </button>
      </div>
    </div>
  );
}
