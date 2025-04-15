'use client';

import { useState } from 'react';

import HomeLayout from './profile-layout';

import styles from './profile.module.css';

export default function Page() {
    const [weeklyBudget, setWeeklyBudget] = useState(44);
    const [maxPrepTime, setMaxPrepTime] = useState(28);
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setWeeklyBudget(value);
    };
  
    const handlePrepTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setMaxPrepTime(value);
    };

    const handleDiataryPreferenceChange = (preference: string) => {
        if (preference && !dietaryPreferences.includes(preference)) {
          setDietaryPreferences([...dietaryPreferences, preference]);
        }
    }

    return (
    <HomeLayout>
        <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Configure Your Meal Plan</h2>

        <div className={styles.preferencesSection}>
          <h3 className={styles.preferencesTitle}>Your Preferences</h3>

          <div className={styles.sliderContainer}>
            <label className={styles.sliderLabel}>Weekly Budget</label>
            <div className={styles.sliderWithValues}>
              <span className={styles.minValue}>$20</span>
              <input
                type="range"
                min="20"
                max="100"
                value={weeklyBudget}
                onChange={handleBudgetChange}
                className={styles.slider}
              />
              <span className={styles.maxValue}>$100</span>
            </div>
            <div className={styles.currentValueContainer}>
              <span className={styles.dollarSign}>$</span>
              <span className={styles.currentValue}>{weeklyBudget}</span>
            </div>
          </div>

          <div className={styles.sliderContainer}>
            <label className={styles.sliderLabel}>Max Prep Time</label>
            <div className={styles.sliderWithValues}>
              <span className={styles.minValue}>10 min</span>
              <input
                type="range"
                min="10"
                max="60"
                value={maxPrepTime}
                onChange={handlePrepTimeChange}
                className={styles.slider}
              />
              <span className={styles.maxValue}>60 min</span>
            </div>
            <div className={styles.currentValueContainer}>
              <span className={styles.currentValue}>{maxPrepTime}</span>
              <span className={styles.unit}> min</span>
            </div>
          </div>

          <div className={styles.dietaryPrefsContainer}>
            <label className={styles.dietaryLabel}>Dietary Preferences</label>
            <button 
              className={dietaryPreferences.length > 0 ? styles.dietaryButton: styles.dietaryButtonEmpty}
              onClick={() => {
                const newPreference = prompt('Enter your dietary preference (e.g., Vegan, Gluten-Free):');
                if (newPreference) {
                  handleDiataryPreferenceChange(newPreference);
                }
              }}
            >
              {
                dietaryPreferences.length > 0
                ? dietaryPreferences.join(', ')
                : 'Select your dietary preferences'
              }
              <span className={styles.plusIcon}>+</span>
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
    );
}