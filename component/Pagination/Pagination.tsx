import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  const getVisiblePages = (): Array<number> => {
    const pagesToShow = 3; // Number of pages to display in the range
    const halfRange = Math.floor(pagesToShow / 2);
    const start = Math.max(1, currentPage - halfRange);
    const end = Math.min(totalPages, start + pagesToShow - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <Flex justifyContent="center" alignItems="center" mt={4} gap={2}>
      <Button
        variant="primary"
        onClick={(): void => {
          onPageChange(currentPage - 1);
        }}
        isDisabled={currentPage + 1 === 1}
      >
        <ArrowLeftIcon />
      </Button>

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage + 1 ? 'primary' : 'secondary'}
          onClick={(): void => {
            onPageChange(page - 1);
          }}
          isLoading={page === currentPage + 1 && isLoading}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="primary"
        onClick={(): void => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        <ArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
