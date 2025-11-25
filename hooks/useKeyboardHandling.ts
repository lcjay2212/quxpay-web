import { useCallback, useEffect } from 'react';

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
const ARROW_KEYS: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const ARROW_STEP = 5;
const ARROW_STEP_FAST = 10;

interface UseKeyboardHandlingProps {
  position: Position;
  updatePosition: (x: number, y: number) => void;
  focusSlider: (ref: React.RefObject<HTMLDivElement>) => void;
  horizontalSliderRef: React.RefObject<HTMLDivElement>;
  verticalSliderRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
  isLoading: boolean;
  isRefetching: boolean;
}

export const useKeyboardHandling = ({
  position,
  updatePosition,
  focusSlider,
  horizontalSliderRef,
  verticalSliderRef,
  visible,
  isLoading,
  isRefetching,
}: UseKeyboardHandlingProps): void => {
  const handleArrowKey = useCallback(
    (key: ArrowKey, shiftKey: boolean): void => {
      const step = shiftKey ? ARROW_STEP_FAST : ARROW_STEP;
      const { x, y } = position;

      const keyActions: Record<ArrowKey, () => void> = {
        ArrowUp: () => {
          updatePosition(x, y - step);
          focusSlider(verticalSliderRef);
        },
        ArrowDown: () => {
          updatePosition(x, y + step);
          focusSlider(verticalSliderRef);
        },
        ArrowLeft: () => {
          updatePosition(x - step, y);
          focusSlider(horizontalSliderRef);
        },
        ArrowRight: () => {
          updatePosition(x + step, y);
          focusSlider(horizontalSliderRef);
        },
      };

      keyActions[key]();
    },
    [position, updatePosition, focusSlider, horizontalSliderRef, verticalSliderRef]
  );

  useEffect(() => {
    if (!visible || isLoading || isRefetching) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (ARROW_KEYS.includes(e.key as ArrowKey)) {
        e.preventDefault();
        handleArrowKey(e.key as ArrowKey, e.shiftKey);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, isLoading, isRefetching, handleArrowKey]);
};
