import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function usePdfs() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['pdfs'], async () => {
    const res = await axios.get('/api/pdfs');
    return res.data;
  });

  const uploadMutation = useMutation(
    async file => {
      const formData = new FormData();
      formData.append('pdf', file);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['pdfs']),
    }
  );

  return {
    pdfs: data || [],
    isLoading,
    uploadPdf: uploadMutation.mutateAsync,
    uploading: uploadMutation.isLoading,
  };
}
