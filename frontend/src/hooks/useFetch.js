import { useState, useEffect } from 'react';

const useFetch = (URL) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const contAbort = new AbortController();
        
        const fetchData = async () => {
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
    }, [URL]);

    return { data, loading, error };
};

export default useFetch;