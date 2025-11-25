import { useCallback, useEffect, useRef } from 'react';

interface UseDragHandlingProps {
  containerRef: React.RefObject<HTMLDivElement>;
  draggableRef: React.RefObject<HTMLDivElement>;
  updatePosition: (x: number, y: number) => void;
}

export const useDragHandling = ({
  containerRef,
  draggableRef,
  updatePosition,
}: UseDragHandlingProps): {
  isDragging: boolean;
  startDragging: (clientX: number, clientY: number) => void;
  stopDragging: () => void;
} => {
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number): void => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const localX = clientX - rect.left - dragOffsetRef.current.x;
      const localY = clientY - rect.top - dragOffsetRef.current.y;
      updatePosition(localX, localY);
    },
    [containerRef, updatePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (!isDraggingRef.current) return;
      handlePointerMove(e.clientX, e.clientY);
    },
    [handlePointerMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent): void => {
      if (!isDraggingRef.current) return;
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    },
    [handlePointerMove]
  );

  const removeDragListeners = useCallback(
    (
      mouseMoveHandler: (e: MouseEvent) => void,
      touchMoveHandler: (e: TouchEvent) => void,
      stopHandler: () => void
    ): void => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', stopHandler as unknown as EventListener);
      document.removeEventListener('touchmove', touchMoveHandler, { passive: false } as AddEventListenerOptions);
      document.removeEventListener('touchend', stopHandler as unknown as EventListener);
    },
    []
  );

  const stopDragging = useCallback((): void => {
    isDraggingRef.current = false;
    removeDragListeners(handleMouseMove, handleTouchMove, stopDragging);
  }, [removeDragListeners, handleMouseMove, handleTouchMove]);

  const startDragging = useCallback(
    (clientX: number, clientY: number): void => {
      const piece = draggableRef.current;
      const container = containerRef.current;
      if (!piece || !container) return;

      const containerRect = container.getBoundingClientRect();
      const pieceRect = piece.getBoundingClientRect();

      dragOffsetRef.current = {
        x: clientX - pieceRect.left - (containerRect.left - pieceRect.left),
        y: clientY - pieceRect.top - (containerRect.top - pieceRect.top),
      };

      isDraggingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopDragging as unknown as EventListener);
      document.addEventListener('touchmove', handleTouchMove, { passive: false } as AddEventListenerOptions);
      document.addEventListener('touchend', stopDragging as unknown as EventListener);
    },
    [containerRef, draggableRef, handleMouseMove, handleTouchMove, stopDragging]
  );

  useEffect(
    () => (): void => {
      isDraggingRef.current = false;
      removeDragListeners(handleMouseMove, handleTouchMove, stopDragging);
    },
    [removeDragListeners, handleMouseMove, handleTouchMove, stopDragging]
  );

  return {
    isDragging: isDraggingRef.current,
    startDragging,
    stopDragging,
  };
};
