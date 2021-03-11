import React from 'react';
import { render, screen } from '@testing-library/react';
import { MindMap } from './MindMap';

describe('view elements', () => {
  test('tabs', () => {
    render(<MindMap />);
    screen.getByLabelText(/^tabs$/i);
  });

  test('actions', () => {
    render(<MindMap />);
    screen.getByLabelText(/^actions$/i);
  });

  test('main view', () => {
    render(<MindMap />);
    screen.getByLabelText(/^main view$/i);
  });
});
