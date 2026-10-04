// Web replacement for React Native's Alert.alert(title, message).
// Rendered at the app root so it stays open across route changes, just like the
// native dialog did when the app navigated right after showing it.
import React, { createContext, useCallback, useContext, useState } from 'react';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [queue, setQueue] = useState([]);

  const alert = useCallback((title, message) => {
    setQueue((q) => [...q, { title, message, key: Date.now() + Math.random() }]);
  }, []);

  const current = queue[0];
  const close = () => setQueue((q) => q.slice(1));

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {current && (
        <div className="alert-backdrop" onClick={close}>
          <div className="alert-box" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {current.title && current.title.trim() && <div className="alert-title">{current.title}</div>}
            <div className="alert-message">{current.message}</div>
            <div className="alert-actions">
              <button type="button" className="alert-ok" onClick={close} autoFocus>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
