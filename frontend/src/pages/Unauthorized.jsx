import React from 'react';
import ErrorLayout from '../components/error/ErrorLayout';
import UnauthorizedContent from '../components/error/UnauthorizedContent';
import ErrorActions from '../components/error/ErrorActions';

const Unauthorized = () => {
    return (
        <ErrorLayout>
            <UnauthorizedContent />
            <ErrorActions />
        </ErrorLayout>
    );
};

export default Unauthorized;
