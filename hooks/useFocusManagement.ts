import { useCallback, useEffect, useRef } from 'react';

const AUTO_BLUR_DELAY = 1000;

interface UseFocusManagementProps {
  containerRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
  isLoading: boolean;
  isRefetching: boolean;
}

export const useFocusManagement = ({
  containerRef,
  visible,
  isLoading,
  isRefetching,
}: UseFocusManagementProps): {
  focusSlider: (ref: React.RefObject<HTMLDivElement>) => void;
  blurAllSliders: () => void;
} => {
  const autoBlurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const blurAllSliders = useCallback((): void => {
    const allSliders = document.querySelectorAll('[role="slider"]');
    allSliders.forEach((slider) => {
      (slider as HTMLElement).blur();
    });
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [containerRef]);

  const clearAutoBlurTimer = useCallback((): void => {
    if (autoBlurTimeoutRef.current) {
      clearTimeout(autoBlurTimeoutRef.current);
      autoBlurTimeoutRef.current = null;
    }
  }, []);

  const resetAutoBlurTimer = useCallback((): void => {
    clearAutoBlurTimer();
    autoBlurTimeoutRef.current = setTimeout(() => {
      blurAllSliders();
      autoBlurTimeoutRef.current = null;
    }, AUTO_BLUR_DELAY);
  }, [blurAllSliders, clearAutoBlurTimer]);

  const focusSlider = useCallback(
    (targetRef: React.RefObject<HTMLDivElement>): void => {
      blurAllSliders();

      setTimeout(() => {
        const sliderInput = targetRef.current?.querySelector('[role="slider"]') as HTMLElement | null;
        if (sliderInput) {
          sliderInput.focus();
          resetAutoBlurTimer();
        }
      }, 0);
    },
    [blurAllSliders, resetAutoBlurTimer]
  );

  useEffect(() => {
    if (visible && !isLoading && !isRefetching) {
      clearAutoBlurTimer();
      blurAllSliders();

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 0);
    } else {
      clearAutoBlurTimer();
    }
  }, [visible, isLoading, isRefetching, blurAllSliders, clearAutoBlurTimer, containerRef]);

  useEffect(() => {
    return (): void => {
      clearAutoBlurTimer();
    };
  }, [clearAutoBlurTimer]);

  return {
    focusSlider,
    blurAllSliders,
  };
};
