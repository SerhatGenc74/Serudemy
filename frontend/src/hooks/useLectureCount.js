import { useState, useEffect } from 'react';

const useLectureCount = (courseId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let aborted = false;
        const controller = new AbortController();

        const fetchCount = async () => {
            if (!courseId) {
                setData(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const resp = await fetch(`http://localhost:5225/api/Lecture/course/${courseId}/count`, { signal: controller.signal });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const result = await resp.json();
                const count = typeof result === 'object' && result.count !== undefined ? result.count : (typeof result === 'number' ? result : 0);
                if (!aborted) setData(count);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message || String(err));
            } finally {
                if (!aborted) setLoading(false);
            }
        };

        fetchCount();

        return () => {
            aborted = true;
            controller.abort();
        };
    }, [courseId]);

    return { data, loading, error };
};

export default useLectureCount;
