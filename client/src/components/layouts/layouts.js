import React from 'react';
import Sidebar from '../../components/sidebar/index.jsx';
export default function Layout({ children }) {
    return (
        <>
  
        <div className="flex">
           
            <Sidebar />
            <main className="flex-grow p-4">
                {children}
            </main>
        </div>
        </>
    );
}
