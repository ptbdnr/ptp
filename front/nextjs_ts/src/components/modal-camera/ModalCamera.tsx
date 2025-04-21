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

const WIDTH = 430;
const HEIGHT = 250;

const videoConstraints = {
    width: WIDTH,
    height: HEIGHT,
    facingMode: "environment"
};

export default function ModalCamera({ open, scan_barcode, onClose, onCapture }: ModalCameraProps) {
    const webcamRef = React.useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    const handleCapture = React.useCallback(() => {
        const imageSrc = webcamRef?.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        };
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
                    width={WIDTH}
                    height={HEIGHT}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
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