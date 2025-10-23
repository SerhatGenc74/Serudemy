import { useState, useCallback } from 'react';

// Provides enroll and unenroll helpers and returns loading/error for last action
const useEnrollmentActions = (baseUrl = 'http://localhost:5225/api/StudentCourse') => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const enroll = useCallback(async (courseId, studentId) => {
        setLoading(true);
        setError(null);
        try {
            const url = `${baseUrl}/enroll/${courseId}/${studentId}`;
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    courseId: parseInt(courseId), 
                    studentId: parseInt(studentId),
                    enrollmentDate: new Date().toISOString()
                })
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || `HTTP ${resp.status}`);
            }
            const json = await resp.json();
            return json;
        } catch (err) {
            setError(err.message || String(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    const unenroll = useCallback(async (courseId, studentId) => {
        setLoading(true);
        setError(null);
        try {
            const url = `${baseUrl}/unenroll/${courseId}/${studentId}`;
            const resp = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || `HTTP ${resp.status}`);
            }
            // NoContent (204) response doesn't have JSON body
            if (resp.status === 204) {
                return { success: true };
            }
            const json = await resp.json();
            return json;
        } catch (err) {
            setError(err.message || String(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    return { loading, error, enroll, unenroll };
};

export default useEnrollmentActions;
