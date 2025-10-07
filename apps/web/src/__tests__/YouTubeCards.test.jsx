import { render, screen } from '@testing-library/react';
import YouTubeCards from '../components/YouTubeCards';

test('renders YouTube video cards', () => {
  const videos = [
    { id: 'abc', title: 'Test Video', thumbnail: 'thumb.jpg', channel: 'Test Channel', publishedAt: '2025-10-01T00:00:00Z' },
  ];
  render(<YouTubeCards videos={videos} />);
  expect(screen.getByText('Test Video')).toBeInTheDocument();
  expect(screen.getByText('Test Channel')).toBeInTheDocument();
});
