// hooks/useScrollPosition.js
import { useEffect, useCallback, useState, useRef } from 'react';

export const useScrollPosition = (pageId) => {
  const [isReady, setIsReady] = useState(false);
  const scrollRestorationAttempted = useRef(false);
  const lastScrollPosition = useRef(0);

  const getStorageKey = () => `scrollPosition_${pageId}`;

  const restoreScrollPosition = useCallback(async () => {
    const scrollPosition = sessionStorage.getItem(getStorageKey());
    
    if (scrollPosition !== null && !scrollRestorationAttempted.current) {
      scrollRestorationAttempted.current = true;
      
      try {
        await Promise.all([
          document.fonts.ready,
          new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve();
            } else {
              window.addEventListener('load', resolve, { once: true });
            }
          }),
        ]);

        await new Promise(resolve => setTimeout(resolve, 100));

        const targetScroll = parseInt(scrollPosition);
        window.scrollTo(0, targetScroll);
        
        setTimeout(() => {
          if (Math.abs(window.scrollY - targetScroll) > 10) {
            window.scrollTo(0, targetScroll);
          }
        }, 50);

        lastScrollPosition.current = targetScroll;
      } catch (error) {
        console.error('Error restoring scroll position:', error);
      }
    }
    
    setIsReady(true);
  }, [pageId]);

  useEffect(() => {
    restoreScrollPosition();

    return () => {
      // Cleanup pada unmount
      sessionStorage.removeItem(getStorageKey());
    };
  }, [restoreScrollPosition]);

  const saveScrollPosition = useCallback((force = false) => {
    if (!isReady && !force) return;

    const currentScroll = Math.max(0, window.scrollY);
    
    if (Math.abs(currentScroll - lastScrollPosition.current) > 10 || force) {
      lastScrollPosition.current = currentScroll;
      sessionStorage.setItem(getStorageKey(), currentScroll.toString());
    }
  }, [isReady, pageId]);

  useEffect(() => {
    if (!isReady) return;

    let timeoutId;
    let rafId;

    const throttledSaveScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        if (timeoutId) clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          saveScrollPosition();
          rafId = null;
        }, 100);
      });
    };

    const handleBeforeUnload = () => {
      saveScrollPosition(true);
    };

    window.addEventListener('scroll', throttledSaveScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const backupInterval = setInterval(() => {
      saveScrollPosition(true);
    }, 2000);

    return () => {
      window.removeEventListener('scroll', throttledSaveScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(backupInterval);
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isReady, saveScrollPosition]);

  return { isReady };
};