'use client';

import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import { Meal } from '@/types/meals';
import { Ingredient } from '@/types/ingredients';
import styles from './MealDetails.module.css';

interface MealDetailsProps {
  meal: Meal;
}

export default function MealDetails({ meal }: MealDetailsProps) {
  const [activeTab, setActiveTab] = useState('ingredients');
  const servings = 4;
  const prepTime = 30;
  const difficulty = 'Med'
  const price = 8.50

  // Determine which ingredients the user has/doesn't have
  const userHasIngredient = (ingredient: Ingredient): boolean => {
    return !ingredient.name.includes(meal.ingredients.ingredients[0].name);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* Meal Hero Image */}
        <div className={styles.heroImageContainer}>
          <HeroCarousel meal={meal} />
          <div className={styles.heroContent}>
            <h1 className={styles.recipeTitle}>{meal.name}</h1>
            <p className={styles.recipeDescription}>{meal.desciption}</p>
          </div>
        </div>
        
        {/* Meal Stats */}
        <div className={styles.recipeStats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⏱</span>
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
            <span className={styles.statIcon}>💲</span>
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
        <button 
          className={`${styles.tab} ${activeTab === 'ingredients' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ingredients
        </button>
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
        {activeTab === 'ingredients' && (
          <div className={styles.ingredientsContainer}>
            <div className={styles.ingredientsHeader}>
              <span>{meal.ingredients.ingredients.length} ingredients</span>
              <button className={styles.adjustButton}>Adjust</button>
            </div>
            <ul className={styles.ingredientsList}>
              {meal.ingredients.ingredients.map((ingredient) => (
                <li 
                  key={ingredient.id} 
                  className={`${styles.ingredientItem} ${userHasIngredient(ingredient) ? styles.hasIngredient : styles.missingIngredient}`}
                >
                  <span className={styles.ingredientCheck}>
                    {userHasIngredient(ingredient) ? '✓' : '✕'}
                  </span>
                  <span className={styles.ingredientName}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'instructions' && (
          <div className={styles.instructionsContainer}>
            <ReactMarkdown>
              {meal.instructions}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.actionButton} disabled>Add to Meal Plan</button>
        <button className={styles.actionButton} disabled>Add to Shopping</button>
      </div>
    </div>
  );
}

function HeroCarousel({meal}: {meal: Meal}) {
  const interval = 100;

  return (
    <Carousel>
      <Carousel.Item interval={interval}>
        <Image 
            src={meal.images.hero_url || "/placeholder-dish_16x4.jpg"}
            alt=""
            fill
            className={styles.heroImage}
        />
      </Carousel.Item>
      <Carousel.Item interval={interval}>
        <Image 
            src={meal.images.hero_url || "/placeholder-dish2_16x4.jpg"}
            alt=""
            fill
            className={styles.heroImage}
        />
      </Carousel.Item>
    </Carousel>
  );
}