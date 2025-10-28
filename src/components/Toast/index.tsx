import React, { useEffect, useState } from 'react';
import styles from './toast.module.scss';

export type ToastPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'top-center' 
  | 'bottom-center';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastProps = {
  id?: string;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number; // en millisecondes
  onClose?: () => void;
  show?: boolean;
  icon?: React.ReactNode;
};

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  position = 'top-right',
  duration = 3000,
  onClose,
  show = true,
  icon
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!show) {
      handleClose();
      return;
    }

    setIsVisible(true);
    setIsExiting(false);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // durée de l'animation de sortie
  };

  if (!isVisible) return null;

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return <span>✓</span>;
      case 'error':
        return <span>✕</span>;
      case 'warning':
        return <span>⚠</span>;
      case 'info':
      default:
        return <span>ℹ</span>;
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[`toast_${type}`]} ${styles[`toast_${position}`]} ${
        isExiting ? styles.toast_exiting : ''
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.toast_content}>
        <div className={styles.toast_icon}>
          {getIcon()}
        </div>
        <div className={styles.toast_message}>
          {message}
        </div>
        <button
          className={styles.toast_close}
          onClick={handleClose}
          aria-label="Fermer la notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
