import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useProgress(userId) {
  return useQuery(['progress', userId], async () => {
    const res = await axios.get('/api/progress', { params: { userId } });
    return res.data;
  });
}
