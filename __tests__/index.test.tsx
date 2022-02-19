import React from 'react';
import {screen, render} from '@testing-library/react';
import HomePage from '../pages/index';

describe('HOME', () => {
  it('should have a heading', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading')[0]).toBeInTheDocument();
  })
})