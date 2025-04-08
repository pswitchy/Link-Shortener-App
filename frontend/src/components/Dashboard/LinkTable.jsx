import React, { useState } from 'react';
import LinkTableRow from './LinkTableRow';
import Spinner from '../Common/Spinner';
import Input from '../Common/Input';
import Pagination from '../Common/Pagination';

const LinkTable = ({ links, loading, error, pagination, onPageChange, onSearchChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearchChange(searchTerm);
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
         // Optional: Trigger search on every keystroke (with debounce) or just on submit
         // Example: Basic trigger on input change (no debounce)
         // onSearchChange(e.target.value);
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
             {/* Search Bar */}
            <form onSubmit={handleSearch} className="p-4 border-b border-gray-200 flex items-center space-x-2">
                <Input
                    id="search"
                    name="search"
                    type="search" // Use type search for potential browser clear buttons
                    placeholder="Search by URL or alias..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="flex-grow"
                />
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Search
                </button>
                 {searchTerm && (
                     <button
                         type="button"
                         onClick={() => { setSearchTerm(''); onSearchChange(''); }} // Clear search
                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                         Clear
                     </button>
                 )}
            </form>

             {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Link</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && (
                            <tr>
                                <td colSpan="6" className="text-center py-10">
                                    <Spinner /> Loading links...
                                </td>
                            </tr>
                        )}
                        {error && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-red-600">
                                    Error loading links: {error}
                                </td>
                            </tr>
                        )}
                        {!loading && !error && links.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No links found. Create one above!
                                </td>
                            </tr>
                        )}
                        {!loading && !error && links.map(link => (
                            <LinkTableRow key={link._id} link={link} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && !error && links.length > 0 && pagination.totalPages > 1 && (
                 <div className="p-4 border-t border-gray-200">
                     <Pagination
                         currentPage={pagination.currentPage}
                         totalPages={pagination.totalPages}
                         onPageChange={onPageChange}
                     />
                 </div>
            )}
        </div>
    );
};

export default LinkTable;