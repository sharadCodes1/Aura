import { api } from './api';

export const uploadFile = async (file: File, onProgress: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const { data } = await api.post('/api/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                onProgress(percentCompleted);
            },
        });

        return data;
    } catch (error) {
        console.error('File upload failed:', error);
        throw error;
    }
};
