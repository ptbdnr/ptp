import styles from './Navigation.module.css';
import { useState } from 'react';

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('discover');
  
  return (
    <nav className={styles.bottomNav}>
      <button 
        className={`${styles.navItem} ${activeTab === 'home' ? styles.active : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <span className={styles.navIcon}>🏠</span>
        <span className={styles.navLabel}>Home</span>
      </button>
      
      <button 
        className={`${styles.navItem} ${activeTab === 'pantry' ? styles.active : ''}`}
        onClick={() => setActiveTab('pantry')}
      >
        <span className={styles.navIcon}>🥕</span>
        <span className={styles.navLabel}>Pantry</span>
      </button>
      
      <button 
        className={`${styles.navItem} ${activeTab === 'discover' ? styles.active : ''}`}
        onClick={() => setActiveTab('discover')}
      >
        <span className={styles.navIcon}>🍽️</span>
        <span className={styles.navLabel}>Discover</span>
      </button>
      
      <button 
        className={`${styles.navItem} ${activeTab === 'plan' ? styles.active : ''}`}
        onClick={() => setActiveTab('plan')}
      >
        <span className={styles.navIcon}>📅</span>
        <span className={styles.navLabel}>Plan</span>
      </button>
      
    </nav>
  );
}