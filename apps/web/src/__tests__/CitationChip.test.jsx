import { render, screen, fireEvent } from '@testing-library/react';
import CitationChip from '../components/CitationChip';

test('renders citation chip and handles click', () => {
  const handleClick = jest.fn();
  render(<CitationChip page={5} quote="Test quote" onClick={handleClick} />);
  expect(screen.getByText(/p.5/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
