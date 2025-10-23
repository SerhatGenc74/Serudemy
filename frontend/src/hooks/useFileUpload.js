import { useState, useCallback } from 'react';

// Uploads a single file and returns { data, loading, error, upload }
const useFileUpload = (uploadUrl = 'http://localhost:5225/api/file/upload') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const upload = useCallback(async (file) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            console.debug('[useFileUpload] starting upload for file:', file && file.name);
            const fd = new FormData();
            fd.append('file', file);

            const resp = await fetch(uploadUrl, {
                method: 'POST',
                body: fd
            });

            if (!resp.ok) {
                const text = await resp.text();
                console.error('[useFileUpload] upload failed response:', resp.status, text);
                throw new Error(text || `Upload failed: ${resp.status}`);
            }

            const result = await resp.json();
            console.debug('[useFileUpload] upload result:', result);
            setData(result);
            return result;
        } catch (err) {
            console.error('[useFileUpload] error:', err);
            setError(err.message || String(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [uploadUrl]);

    return { data, loading, error, upload };
};

export default useFileUpload;
