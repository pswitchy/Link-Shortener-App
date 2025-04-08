import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLinks } from '../features/links/linksSlice';
import CreateLinkForm from '../components/Dashboard/CreateLinkForm';
import LinkTable from '../components/Dashboard/LinkTable';
import Navbar from '../components/Layout/Navbar'; // Assuming Navbar is in Layout
import Spinner from '../components/Common/Spinner'; // Assuming Spinner component

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { links, loading, error, pagination } = useSelector((state) => state.links);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState('');

   // Use useCallback to memoize fetch function to prevent unnecessary refetches if passed down
   const loadLinks = useCallback((page, search) => {
        dispatch(fetchLinks({ page, search }));
   }, [dispatch]);


  // Initial fetch on component mount and when page or search changes
  useEffect(() => {
      loadLinks(currentPage, currentSearch);
  }, [loadLinks, currentPage, currentSearch]);

  const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      // No need to call loadLinks here, useEffect dependency array handles it
  };

  const handleSearchChange = (searchTerm) => {
       setCurrentPage(1); // Reset to first page on new search
       setCurrentSearch(searchTerm);
       // No need to call loadLinks here, useEffect dependency array handles it
  };


  return (
    <>
      {/* Navbar is likely rendered in App.jsx for persistent layout */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

        {/* Create Link Form */}
        <CreateLinkForm />

        {/* Links Table */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Your Links</h2>
        <LinkTable
            links={links}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearchChange={handleSearchChange}
        />
      </div>
    </>
  );
};

export default DashboardPage;