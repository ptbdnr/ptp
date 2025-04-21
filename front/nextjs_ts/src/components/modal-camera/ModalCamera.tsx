'use client';

import React, { useRef } from 'react';

import Webcam from "react-webcam";

import styles from './ModalCamera.module.css';

interface ModalCameraProps {
    open: boolean;
    scan_barcode: boolean;
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
};

export default function ModalCamera({ open, scan_barcode, onClose, onCapture }: ModalCameraProps) {
    const webcamRef = React.useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    const handleCapture = React.useCallback(() => {
        const imageSrc = webcamRef?.current?.getScreenshot();
        imageSrc && onCapture(imageSrc);
    }, [webcamRef]);

    if (!open) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.videoContainer}>
                <Webcam
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    width={1280}
                    videoConstraints={videoConstraints}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {open && scan_barcode && (
                        <div className={styles.barScannerOverlay}>
                            <div className={styles.barScannerLine}></div>
                        </div>
                    )}
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