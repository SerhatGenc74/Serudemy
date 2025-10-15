import { useState, useEffect, useCallback } from 'react';

const useFetch = (URL) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refetchFlag, setRefetchFlag] = useState(0);
    
    const refetch = useCallback(() => {
        setRefetchFlag(prev => prev + 1);
    }, []);
    
    useEffect(() => {
        const contAbort = new AbortController();
        
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch(URL, {
                    signal: contAbort.signal
                });
                
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    setError(`HTTP Error: ${response.status}`);
                }
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("fetch aborted");
                } else {
                    setError("Error fetching data: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (URL) {
            fetchData();
        }

        return () => {
            contAbort.abort();
        };
    }, [URL, refetchFlag]);

    return { data, loading, error, refetch };
};

export default useFetch;