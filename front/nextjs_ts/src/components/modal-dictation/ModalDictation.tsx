import React, { useState } from 'react';
import styles from './ModalDictation.module.css';

interface ModalDictationProps {
  open: boolean;
  onClose: () => void;
  onCapture: (text: string) => void;
}

export default function ModalDictation({ open, onClose, onCapture }: ModalDictationProps) {
  const [dictatedText, setDictatedText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDictatedText(e.target.value);
  };

  const handleCapture = () => {
    onCapture(dictatedText);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>Dictation</h2>
        <p className={styles.instructions}>
          Use your device’s dictation service (tap the microphone icon on your keyboard, if available) to speak.
        </p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Dictate here..."
            value={dictatedText}
            onChange={handleChange}
            x-webkit-speech="true"
            className={styles.textInput}
          />
        </div>
        <div className={styles.buttons}>
          <button
            onClick={handleCapture}
            className={styles.captureButton}
            disabled={!dictatedText}
          >
            Save Dictation
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}