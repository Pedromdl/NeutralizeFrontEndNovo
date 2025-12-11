// components/Loading/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ 
  message = "Carregando...", 
  fullScreen = true,
  size = "medium",
  timeoutMessage = "Carregamento está demorando mais que o esperado",
  showTimeout = false,
  onRetry 
}) {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  const content = (
    <div className={`loading-content ${showTimeout ? 'timeout' : ''}`}>
      {showTimeout ? (
        <>
          <div className="error-icon">⏱️</div>
          <p className="error-text">{timeoutMessage}</p>
          {onRetry && (
            <button className="retry-button" onClick={onRetry}>
              Tentar novamente
            </button>
          )}
        </>
      ) : (
        <>
          <div className={`spinner ${sizeClass}`}></div>
          <p className="loading-text">{message}</p>
        </>
      )}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-container">{content}</div>;
  }

  return content;
}