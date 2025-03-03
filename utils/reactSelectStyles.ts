import { CSSObject } from '@emotion/react';

export const reactSelectStyles = {
  menu: (provided: CSSObject): CSSObject => ({
    ...provided,
    marginTop: 5,
  }),
  control: (provided: CSSObject): CSSObject => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    borderRadius: '16px',
    color: 'white',
  }),
  indicatorsContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
    background: '#10101F',
    borderBlockStart: '1px solid #4D4D6B',
    borderBlockEnd: '1px solid #4D4D6B',
    borderInlineEnd: '1px solid #4D4D6B',
    borderTopRightRadius: '16px',
    borderBottomRightRadius: '16px',
  }),
  valueContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    padding: 13,
    fontSize: '1rem',
    borderBlockStart: '1px solid #4D4D6B',
    borderBlockEnd: '1px solid #4D4D6B',
    borderInlineStart: '1px solid #4D4D6B',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
    background: '#10101F',
    textAlign: 'start',
    color: 'white',
    ':active': {
      background: '#000000',
      borderColor: '#06A499',
    },
  }),
  singleValue: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
  }),
  input: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
  }),
};
