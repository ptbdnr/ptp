import { useState } from 'react';
import styles from './ModalPreferences.module.css';

interface ModalPreferencesProps {
    onClose: () => void;
    onSave: (preferences: Array<string>) => void;
  }

export default function DietaryPreferencesModal({ onClose, onSave }: ModalPreferencesProps) {
  const [dietType, setDietType] = useState('');
  const [allergies, setAllergies] = useState<Array<string>>([]);
  const [additionalPreferences, setAdditionalPreferences] = useState('');

  const handleAllergiesChange = (restriction: string) => {
    if (allergies.includes(restriction)) {
      setAllergies(allergies.filter(item => item !== restriction));
    } else {
      setAllergies([...allergies, restriction]);
    }
  };

  const handleSave = () => {
    const combinedPreferences = [
        ...allergies,
        dietType !== 'No Restrictions' ? dietType : '',
        additionalPreferences
      ].filter(Boolean);
    onSave(combinedPreferences);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Select Your Dietary Preferences</h2>
        <p className={styles.modalDesc}>
          This helps us suggest recipes that match your needs
        </p>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Diet Type</h3>
          <div className={styles.radioGroup}>
            {['No Restrictions', 'Vegetarian', 'High Protein', 'Low Carb', 'Keto', 'Paleo'].map((diet) => (
              <label key={diet} className={styles.optionLabel}>
                <input 
                  type="radio" 
                  name="dietType"
                  checked={dietType === diet}
                  onChange={() => setDietType(diet)}
                  className={styles.inputControl}
                />
                <span>{diet}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Allergies & Restrictions</h3>
          <div className={styles.checkboxGroup}>
            {['Gluten Free', 'Dairy Free', 'Nut Free', 'Low Carb', 'Vegetarian'].map((restriction) => (
              <label key={restriction} className={styles.optionLabel}>
                <input 
                  type="checkbox"
                  checked={allergies.includes(restriction)}
                  onChange={() => handleAllergiesChange(restriction)}
                  className={styles.inputControl}
                />
                <span>{restriction}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Additional Preferences</h3>
          <textarea
            className={styles.textArea}
            placeholder="Enter any other dietary preferences or notes..."
            rows={3}
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
          />
        </div>
        
        <button onClick={handleSave} className={styles.button}>
          Continue
        </button>
      </div>
    </div>
  );
}