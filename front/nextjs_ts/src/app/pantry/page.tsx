'use client';

import { useState, useEffect } from 'react';

import { Ingredient } from '@/types/ingredients';

import PantryLayout from './pantry-layout';

import ModalCamera from '@/components/modal-camera/ModalCamera';
import ModalDictation from '@/components/modal-dictation/ModalDictation';

import styles from './pantry.module.css';

export default function Page() {
  // input modalities
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDictationOpen, setDictationOpen] = useState(false);
  const [inputText, setInputText] = useState<string | null>(null);

  const [pantryItems, setPantryItems] = useState<Ingredient[]>([]);
  const [newPantryItems, setNewPantryItems] = useState<Ingredient[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) {
          throw new Error('Failed to fetch meals');
        }
        const data = await res.json();
        setPantryItems(data.ingredients);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeals();
  }, []);

  async function handleCapture (imageData: string) {
    setCapturedImage(imageData);
    setCameraOpen(false);
    try {
      const res = await fetch('/api/img_to_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage }),
      }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch description of image.');
      }
      const data = await res.json();
      console.log('Response from API img_to_text:', data);
      handleDictation(data.content);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleDictation (text: string) {
    setInputText(text);
    setDictationOpen(false);
    try {
      const url = `/api/text_to_ingredients?content=${text}`;
      console.log('GET URL:', url);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch ingredients from text.');
      }
      const data = await res.json();
      console.log('Response from API text_to_ingredients:', data);
      const newIngredients = data.ingredients;
      setNewPantryItems(newIngredients);
      // Use functional update to ensure the latest state is used.
      setPantryItems(prev => {
        const updated = prev.concat(newIngredients);
        upsertPantry(updated);
        return updated;
      });
    } catch (error) {
      console.error(error);
    }    
  };

  async function upsertPantry(items: Ingredient[]) {
    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: items }),
      });
      if (!res.ok) {
        throw new Error('Failed to upsert pantry items');
      }
      const data = await res.json();
      console.log('Response from API upsert:', data);
    }
    catch (error) {
      console.error(error);
    }
  }

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

        <div className={styles.inputs}>
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.actionButton} ${styles.scanButton}`} 
              onClick={() => setCameraOpen(true)}
            >
              📸<br />Take<br/>Picture
            </button>
            <button 
              className={`${styles.actionButton} ${styles.addButton}`} 
              onClick={() => setCameraOpen(true)}
            >
              🧾<br />Scan<br/>Receipt
            </button>
            <button 
              className={`${styles.actionButton} ${styles.importButton}`} 
              onClick={() => setDictationOpen(true)}
            >
              🎙️<br />Dictate <br/> or Type
            </button>
            <ModalCamera open={isCameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleCapture} />
            <ModalDictation open={isDictationOpen} onClose={() => setDictationOpen(false)} onCapture={handleDictation} />
          </div>
          {newPantryItems.length > 0 && (
            <div className={styles.newItemsNotification}>
              <p>New items added to your pantry!</p>
              <ul>
                {newPantryItems.map(item => (
                  <li key={item.id}>{item.name} - {item.quantity} {item.unit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
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