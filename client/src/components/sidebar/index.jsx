import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../../components/sidebar/sidebar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar() {
  const SidebarInputs = [
    { id: 1, name: 'Dashboard', icon: 'bx bxs-dashboard', path: '/dashboard' },
    { id: 2, name: 'Vendor Registration', icon: 'bx bxs-user-plus', path: '/vendor-registration' },
    { id: 3, name: 'Vendor List', icon: 'bx bx-list-ul', path: '/vendor-list' },
    { id: 4, name: 'Bank Details', icon: 'bx bxs-bank', path: '/bank-details' },
    { id: 5, name: 'Bank List', icon: 'bx bxs-info-circle', path: '/bank-list' },
    { id: 6, name: 'Customer', icon: 'bx bxs-user', path: '/customer' },
    { id: 7, name: 'Customer List', icon: 'bx bxs-user', path: '/customer-list' },
    { id: 8, name: 'Products', icon: 'bx bxs-package', path: '/products' },
    { id: 9, name: 'Product List', icon: 'bx bxs-store', path: '/product-list' },
    { id: 9, name: 'Report', icon: 'bx bxs-report', path: '/report' },
    { id: 10, name: 'Logout', icon: 'bx bx-log-out', path: '/logout' }, 
  ];

  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSidebar = () => setSidebar((prev) => !prev);
  const handleCloseSidebar = () => setSidebar(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/logout`);
      localStorage.removeItem('token');
      navigate('/');
     toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout. Please try again.');
    }
  };

  return (
    <div>
      <button
        type="button"
        aria-controls="default-sidebar"
        aria-expanded={sidebar}
        onClick={handleToggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {sidebar && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
        ></div>
      )}

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebar ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <h5 className="py-2" style={{ color: '#4996ff' }}>Vendor Management</h5>
          <ul className="space-y-2 font-medium">
            {SidebarInputs.map((item) => (
              <li key={item.id} className="sidebar-item">
                {item.name === 'Logout' ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <i className={`${item.icon} sidebar-icon`} style={{ color: '#4996ff' }}></i>
                    <span className="ms-3">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      location.pathname === item.path ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    onClick={handleCloseSidebar}
                  >
                    <i className={`${item.icon} sidebar-icon`} style={{ color: '#4996ff' }}></i>
                    <span className="ms-3">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
