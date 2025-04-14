import React, { useRef, useEffect } from 'react';
import styles from './ModalCamera.module.css';

interface ModalCameraProps {
    open: boolean;
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

export default function ModalCamera({ open, onClose, onCapture }: ModalCameraProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (open) {
            navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } } // Default to rear camera
            })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error('Error accessing camera:', err));
        } else {
            // Stop video stream on close
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
        // Cleanup on unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [open]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const width = videoRef.current.videoWidth;
            const height = videoRef.current.videoHeight;
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, width, height);
                const imageData = canvasRef.current.toDataURL('image/png').split(',')[1]; // Extract base64 part
                onCapture(imageData);
            }
        }
    };

    if (!open) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.videoContainer}>
                    <video ref={videoRef} autoPlay className={styles.video} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
                <div className={styles.buttons}>
                    <button onClick={handleCapture} className={styles.captureButton}>
                        Capture Photo
                    </button>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}