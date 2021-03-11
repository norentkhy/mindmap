import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MindMap } from './MindMap';
import userEvent from '@testing-library/user-event';

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

  test('rename a tab', () => {
    render(<MindMap />);
    fireEvent.click(screen.getByLabelText('add new tab'));
    fireEvent.doubleClick(screen.getByText('untitled'));

    const someNewTitle = 'some new title';
    userEvent.type(document.activeElement, someNewTitle);
    userEvent.type(document.activeElement, '{enter}');

    expect(screen.getByText(someNewTitle)).toBeVisible();
  });
});
