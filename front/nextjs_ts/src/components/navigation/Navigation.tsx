'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './Navigation.module.css';

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();
  
  return (
    <nav className={styles.bottomNav}>
      <button 
        className={`${styles.navItem} ${activeTab === 'home' ? styles.active : ''}`}
        onClick={() => {
          setActiveTab('home'); 
          router.push('/home');
        }}
      >
        <span className={styles.navIcon}>🏠</span>
        <span className={styles.navLabel}>Home</span>
      </button>
      
      <button 
        className={`${styles.navItem} ${activeTab === 'pantry' ? styles.active : ''}`}
        onClick={() => {
          setActiveTab('pantry');
          router.push('/pantry')
        }}
      >
        <span className={styles.navIcon}>🥕</span>
        <span className={styles.navLabel}>Pantry</span>
      </button>
      
      <button 
        className={`${styles.navItem} ${activeTab === 'discover' ? styles.active : ''}`}
        onClick={() => {
          setActiveTab('discover');
          router.push('/meal-discovery')
        }}
      >
        <span className={styles.navIcon}>🍽️</span>
        <span className={styles.navLabel}>Discover</span>
      </button>
      
      <button 
        className={`${styles.navItem} ${activeTab === 'plan' ? styles.active : ''}`}
        onClick={() => {
          setActiveTab('plan');
          router.push('/meal-plan')
        }}
      >
        <span className={styles.navIcon}>📅</span>
        <span className={styles.navLabel}>Plan</span>
      </button>
      
    </nav>
  );
}