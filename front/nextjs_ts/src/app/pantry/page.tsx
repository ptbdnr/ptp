'use client';

import { useRef, useState, useEffect } from 'react';
import { usePantryContext } from '@/contexts/PantryContext';
import { ToastContainer, toast, Id } from 'react-toastify';

import { Ingredient } from '@/types/ingredients';

import PantryLayout from './pantry-layout';

import ModalCamera from '@/components/modal-camera/ModalCamera';
import ModalDictation from '@/components/modal-dictation/ModalDictation';

import styles from './pantry.module.css';
import ai_styles from './ai-container.module.css';

export default function Page() {
  // input modalities
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [isDictationOpen, setDictationOpen] = useState(false);
  const [inputText, setInputText] = useState("")
  const { ingredients, setIngredients, isLoading } = usePantryContext();

  const [newPantryItems, setNewPantryItems] = useState<Ingredient[]>([]);
  
  const toastId = useRef<Id | undefined>(undefined);
  const notifyImageProcessStart = () => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
    toastId.current = toast("👀 LumaLabs", {autoClose: 8000});
  }
  const notifyTextProcessStart = () => {
    if (toastId.current) {
      toast.dismiss(toastId.current);
    }
    toastId.current = toast(`🤖 Mistral`, {autoClose: 5000});
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('/api/ingredients');
        if (!res.ok) {
          throw new Error('Failed to fetch meals');
        }
        const data = await res.json();
        setIngredients({ingredients: data.ingredients});
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeals();
  }, [setIngredients]);

  async function handleCapture (imageData: string) {
    setCameraOpen(false);
    notifyImageProcessStart()
    try {
      const res = await fetch('/api/img_to_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch description of image.');
      }
      const data = await res.json();
      console.log('Response from API img_to_text:', data);
      setInputText(data.text);
      handleDictation(data.text);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleDictation (text: string) {
    setDictationOpen(false);
    notifyTextProcessStart();
    try {
      const url = `/api/text_to_ingredients?text=${text}`;
      console.log('GET URL:', url);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      if (toastId.current) {
        toast.dismiss(toastId.current);
      }
      if (!res.ok) {
        setInputText("Ops, something went wrong. 💔 Please try again.");
        throw new Error('Failed to fetch ingredients from text.');
      }
      const data = await res.json();
      console.log('Response from API text_to_ingredients:', data);
      const newIngredients = data.ingredients;
      setInputText("");
      setNewPantryItems(newIngredients);
      // Use functional update to ensure the latest state is used.
      const updatedIngredients = ingredients.ingredients.concat(newIngredients);
      upsertPantry(updatedIngredients);
      setIngredients({ ingredients: updatedIngredients });
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

  if (isLoading) return <div>Loading...</div>;
  if (!ingredients) return <div>Please log in</div>;

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
          
          {inputText.length > 0 && (
            <div className={styles.newItemsNotification}>
              <div className={ai_styles.container}>
                <div className={ai_styles.border_animation}>
                  <div className={ai_styles.content}>
                    {inputText}
                  </div>
                </div>
              </div>
            </div>
          )}

          {newPantryItems.length > 0 && (
            <div className={ai_styles.container}>
              <div className={ai_styles.border_animation}>
                <p>New items added to your pantry!</p>
                <ul>
                  {newPantryItems.map(item => (
                    <li key={item.id}>{item.name}: {item.quantity} {item.unit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <section className={styles.pantryItemsSection}>
          <h2 className={styles.sectionTitle}>Your Pantry Items</h2>
          
          <div className={styles.pantryList}>
            {ingredients.ingredients.map(item => {
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
        <ToastContainer />
      </PantryLayout>
  );
}