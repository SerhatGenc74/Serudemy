import React from 'react';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import '../../styles/Layout.css';

const Layout = ({ children, showBreadcrumb = true }) => {
    return (
        <div className="layout">
            <Navbar />
            {showBreadcrumb && <Breadcrumb />}
            <main className={`main-content ${showBreadcrumb ? 'with-breadcrumb' : 'without-breadcrumb'}`}>
                {children}
            </main>
        </div>
    );
};

export default Layout;