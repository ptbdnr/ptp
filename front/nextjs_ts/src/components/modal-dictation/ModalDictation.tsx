import React, { useState } from 'react';

import { MicIcon } from 'lucide-react';

import styles from './ModalDictation.module.css';



interface ModalDictationProps {
  open: boolean;
  onClose: () => void;
  onCapture: (text: string) => void;
}

export default function ModalDictation({ open, onClose, onCapture }: ModalDictationProps) {
  const [dictatedText, setDictatedText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <h2 className={styles.title}>Dictate or Type</h2>
        {/* 
        <p className={styles.instructions}>
          Tap the microphone icon on your keyboard, if available.
          <br />
          Or type your text in the input field.
        </p> 
        */}
        <div className={styles.inputContainer}>
          <textarea
            placeholder="Type here..."
            value={dictatedText}
            onChange={(e) => handleChange(e)}
            className={styles.textInput}
            rows={4}
          />
            <button 
            className={styles.startButton}
            onClick={() => {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                console.log('Microphone access granted:', stream);
                // You can add further logic to handle the audio stream here
                })
                .catch((error) => {
                console.error('Microphone access denied:', error);
                });
              } else {
              console.error('getUserMedia is not supported in this browser.');
              }
            }}
            >
            <MicIcon size={'64px'} />
            </button>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={handleCapture}
            className={styles.captureButton}
            disabled={!dictatedText}
          >
            Save
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}