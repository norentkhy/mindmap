import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

describe('tabs integration', () => {
  test('add a new tab', () => {
    render(<MindMap />);
    expect(screen.queryByText('untitled')).toBeNull();

    fireEvent.click(screen.getByLabelText('add new tab'));
    expect(screen.getByText('untitled')).toBeVisible();

    fireEvent.click(screen.getByLabelText('add new tab'));
    expect(screen.getAllByText('untitled').length).toBe(2);
  });
});
