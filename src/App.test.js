import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page header', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'header' })).toBeInTheDocument();
});
