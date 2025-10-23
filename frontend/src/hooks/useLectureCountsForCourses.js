import { useState, useEffect } from 'react';

// Accepts array of course objects or courseIds, returns map { [courseId]: count }
const useLectureCountsForCourses = (courses) => {
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const courseIds = (courses || []).map(c => (typeof c === 'string' || typeof c === 'number') ? c : c.courseId || c.id);
        if (courseIds.length === 0) {
            setCounts({});
            setLoading(false);
            return;
        }

        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const results = {};
                for (const id of courseIds) {
                    if (controller.signal.aborted) break;
                    try {
                        const resp = await fetch(`http://localhost:5225/api/Lecture/course/${id}/count`, { signal: controller.signal });
                        if (!resp.ok) {
                            results[id] = 0;
                            continue;
                        }
                        const num = await resp.json();
                        results[id] = typeof num === 'object' && num.count !== undefined ? num.count : (typeof num === 'number' ? num : 0);
                    } catch (err) {
                        results[id] = 0;
                    }
                }
                if (mounted) setCounts(results);
            } catch (err) {
                if (mounted) setError(err.message || String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchAll();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [JSON.stringify(courses || [])]);

    return { data: counts, loading, error };
};

export default useLectureCountsForCourses;
