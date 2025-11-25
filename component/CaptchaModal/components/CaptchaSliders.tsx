import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { FC, RefObject } from 'react';

interface VerticalSliderProps {
  position: Position;
  maxPosition: number;
  verticalSliderRef: RefObject<HTMLDivElement>;
  updatePosition: (x: number, y: number) => void;
}

export const VerticalSlider: FC<VerticalSliderProps> = ({
  position,
  maxPosition,
  verticalSliderRef,
  updatePosition,
}) => {
  return (
    <Box ref={verticalSliderRef} h={300}>
      <Slider
        min={0}
        max={maxPosition}
        isReversed
        value={position.y}
        orientation="vertical"
        onChange={(value): void => updatePosition(position.x, value)}
        aria-label="Vertical position"
      >
        <SliderTrack bg="gray.200" w="8px" borderRadius="full">
          <SliderFilledTrack bg="teal.500" />
        </SliderTrack>
        <SliderThumb boxSize={8} bg="teal.500" border="3px solid white" boxShadow="md" />
      </Slider>
    </Box>
  );
};

interface HorizontalSliderProps {
  position: Position;
  maxPosition: number;
  horizontalSliderRef: RefObject<HTMLDivElement>;
  updatePosition: (x: number, y: number) => void;
}

export const HorizontalSlider: FC<HorizontalSliderProps> = ({
  position,
  maxPosition,
  horizontalSliderRef,
  updatePosition,
}) => {
  return (
    <Box width={300} ref={horizontalSliderRef} mt={4} mx="auto">
      <Slider
        value={position.x}
        onChange={(value): void => updatePosition(value, position.y)}
        min={0}
        max={maxPosition}
        aria-label="Horizontal position"
      >
        <SliderTrack bg="gray.200" h="8px" borderRadius="full">
          <SliderFilledTrack bg="teal.500" />
        </SliderTrack>
        <SliderThumb boxSize={8} bg="teal.500" border="3px solid white" boxShadow="md" />
      </Slider>
    </Box>
  );
};
