export const PRIMARY = {
  transition: '0.25s ease-in',
  background: 'btn.background-base',
  color: 'btn.text-base',
  _hover: {
    background: 'btn.background-hover',
    color: 'btn.text-hover',
    _disabled: {
      background: 'btn.background-hover',
      color: 'btn.text-hover',
    },
  },
  _disabled: {
    background: 'btn.background-hover',
    color: 'btn.text-hover',
    opacity: '0.5',
    cursor: 'not-allowed',
  },
};

export const SECONDARY = {
  transition: '0.25s ease-in',
  background: 'btn.background-hover',
  color: 'btn.text-hover',
  _hover: {
    background: 'btn.background-base',
    color: 'btn.text-base',
    _disabled: {
      background: 'btn.background-base',
      color: 'btn.text-base',
    },
  },
  _disabled: {
    background: 'btn.background-base',
    color: 'btn.text-base',
    opacity: '0.5',
    cursor: 'not-allowed',
  },
};
