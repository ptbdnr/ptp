import React, { useState, useRef } from 'react';

import { MicIcon, MicOffIcon } from 'lucide-react';

import styles from './ModalDictation.module.css';

interface ModalDictationProps {
  open: boolean;
  onClose: () => void;
  onCapture: (text: string) => void;
}

export default function ModalDictation({ open, onClose, onCapture }: ModalDictationProps) {
  const [listening, setListening] = useState(false);
  const [dictatedText, setDictatedText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDictatedText(e.target.value);
  };

  const handleCapture = () => {
    onCapture(dictatedText);
    onClose();
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    // if already listening, stop
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    // otherwise start listening
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setDictatedText((prev) => prev + ' ' + transcript);
    }
    recognition.start();
    recognitionRef.current = recognition;
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>Dictate or Type</h2>
        <div className={styles.inputContainer}>
          <textarea
            placeholder="Type here..."
            value={dictatedText}
            onChange={(e) => handleChange(e)}
            className={styles.textInput}
            rows={4}
          />
            {listening ? 
              <button 
                className={styles.startButton}
                onClick={toggleVoiceInput}
              >
                <MicOffIcon size={'64px'} />
              </button>
            : 
              <button 
                className={styles.startButton}
                onClick={toggleVoiceInput}
              >
                <MicIcon size={'64px'} />
              </button>
            }
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