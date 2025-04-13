'use client';

import { useState } from 'react';

import { Ingredient } from '@/types/ingredients';
import { mockupIngredients } from '@/data/ingredients';

import PantryLayout from './pantry-layout';

import styles from './pantry.module.css';

export default function Page() {

    // const [searchTerm, setSearchTerm] = useState('');
    const [pantryItems] = useState<Ingredient[]>(mockupIngredients);
  
    // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   setSearchTerm(e.target.value);
    // };
  
    const getExpiryStatus = (expiryDate: string | undefined) => {
      if (!expiryDate) return null;
      
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 5) {
        return { status: 'Fresh', className: styles.fresh };
      } else if (diffDays <= 5 && diffDays > 1) {
        return { status: `Expires in ${diffDays} days`, className: styles.expiringLater };
      } else if (diffDays === 1) {
        return { status: 'Expires tomorrow', className: styles.expiringSoon };
      } else if (diffDays <= 0) {
        return { status: 'Expired', className: styles.expired };
      } else {
        return { status: 'Expires soon', className: styles.expiringSoon };
      }
    };
  
    return (
        <PantryLayout>
  
          <div className={styles.actionButtons}>
            <button className={`${styles.actionButton} ${styles.scanButton}`}>
                📸 Take<br/>Picture
            </button>
            <button className={`${styles.actionButton} ${styles.addButton}`}>
                🎙️ Dictate 
            </button>
            <button className={`${styles.actionButton} ${styles.importButton}`}>
                🖮 Add<br/>Manually
            </button>
          </div>
  
          {/* 
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>
          </div> 
          */}

          <section className={styles.pantryItemsSection}>
            <h2 className={styles.sectionTitle}>Your Pantry Items</h2>
            
            <div className={styles.pantryList}>
              {pantryItems.map(item => {
                const expiryStatus = getExpiryStatus(item.expiryDate);
                
                return (
                  <div key={item.id} className={styles.pantryItem}>
                    <div className={styles.ingredientIcon}>
                      {item.images?.thumbnail_url}
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                        {expiryStatus && (
                          <>
                            <span className={styles.separator}>•</span>
                            <span className={expiryStatus.className}>{expiryStatus.status}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <button className={styles.editButton} disabled>Edit</button>
                  </div>
                );
              })}
            </div>
          </section>
        </PantryLayout>
    );
}