import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatReadableDate, formatShortDate } from '../../utils/formatDate'; // Assuming these exist
import Button from '../Common/Button'; // Assuming Button component exists
import QrCodeModal from './QRCodeModal'; // Assuming QR Code Modal component exists
import AnalyticsCharts from './AnalyticsCharts'; // Assuming Analytics component exists
import EditLinkModal from './EditLinkModal'; // Import Edit Modal
import ConfirmDeleteModal from '../Common/ConfirmDeleteModal'; // Import Delete Modal
import {
    fetchLinkAnalytics,
    clearAnalytics,
    deleteLink,
    fetchLinks // Import fetchLinks for refresh after delete
} from '../../features/links/linksSlice'; // Ensure paths are correct
import Spinner from '../Common/Spinner'; // Assuming Spinner component exists

const LinkTableRow = ({ link }) => {
    // State for modals
    const [showQrModal, setShowQrModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal

    const dispatch = useDispatch();
    // Select relevant state from Redux
    const {
        currentLinkAnalytics,
        loadingAnalytics,
        analyticsError,
        loadingDelete // Get loading state for delete operation
    } = useSelector(state => state.links);
    // Get current page for potential refresh after delete
    const { currentPage } = useSelector((state) => state.links.pagination);

    // Handler to toggle analytics display
    const handleShowAnalytics = () => {
        if (showAnalytics) {
            setShowAnalytics(false);
            dispatch(clearAnalytics()); // Clear analytics data when hiding
        } else {
            // Fetch analytics data for the specific link
            dispatch(fetchLinkAnalytics(link._id));
            setShowAnalytics(true);
        }
    };

    // Determine expiration status and styling
    const expirationStatus = link.expiresAt
        ? (new Date(link.expiresAt) < new Date() ? 'Expired' : `Expires ${formatShortDate(link.expiresAt)}`)
        : 'Never';
    const expirationClass = link.expiresAt && new Date(link.expiresAt) < new Date()
        ? 'text-red-600 font-medium'
        : 'text-gray-500';

    // Handler for confirming deletion
    const handleDeleteConfirm = () => {
        dispatch(deleteLink(link._id)).then(action => {
            // Check if the deleteLink action was fulfilled successfully
            if (deleteLink.fulfilled.match(action)) {
                setShowDeleteModal(false); // Close modal on success
                // Refetch links for the current page after deletion.
                // This is important because removing an item might change
                // the total number of pages or the items on the current page.
                dispatch(fetchLinks({ page: currentPage }));
            } else {
                // Optional: Log error or show notification if deletion fails
                console.error("Failed to delete link:", action.payload || 'Unknown error');
                // Optionally keep the modal open and display an error message inside it
            }
        });
    };

    return (
        <>
            {/* Main table row for the link */}
            <tr className="bg-white hover:bg-gray-50 border-b">
                {/* Original URL */}
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline truncate block" title={link.originalUrl}>
                        {link.originalUrl}
                    </a>
                </td>
                {/* Short Link */}
                <td className="px-4 py-3 text-sm">
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium block" title={`Short URL: ${link.shortUrl}`}>
                        {/* Display just the path part for brevity */}
                        /{link.shortCode}
                    </a>
                </td>
                {/* Clicks */}
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{link.totalClicks ?? 0}</td>
                {/* Created Date */}
                <td className="px-4 py-3 text-sm text-gray-500">{formatShortDate(link.createdAt)}</td>
                {/* Expiration Status */}
                <td className={`px-4 py-3 text-sm ${expirationClass}`}>{expirationStatus}</td>
                {/* Action Buttons */}
                <td className="px-4 py-3 text-sm text-gray-700 space-x-1 whitespace-nowrap">
                    {/* QR Code Button */}
                    <Button size="sm" variant="secondary" onClick={() => setShowQrModal(true)} title="Show QR Code">
                        QR
                    </Button>
                    {/* Analytics Button */}
                    <Button size="sm" variant="secondary" onClick={handleShowAnalytics} title="Show/Hide Stats">
                        {showAnalytics ? 'Hide Stats' : 'Stats'}
                    </Button>
                    {/* Edit Button */}
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowEditModal(true)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50" // Example styling
                        title="Edit Link"
                    >
                        Edit
                    </Button>
                    {/* Delete Button */}
                    <Button
                        size="sm"
                        variant="danger" // Use danger variant for delete
                        onClick={() => setShowDeleteModal(true)}
                        isLoading={loadingDelete} // Show loading state from Redux
                        disabled={loadingDelete}
                        className="text-red-600 border-red-300 hover:bg-red-50" // Example styling
                        title="Delete Link"
                    >
                        {/* Show ellipsis or spinner when loading */}
                        {loadingDelete ? '...' : 'Del'}
                    </Button>
                </td>
            </tr>

            {/* Conditionally rendered row for Analytics Charts */}
            {showAnalytics && (
                <tr className="bg-gray-50">
                    <td colSpan="6" className="px-4 py-4 border-b"> {/* Ensure consistent border */}
                        {loadingAnalytics && (
                            <div className="flex justify-center items-center p-4 space-x-2 text-gray-500">
                                <Spinner size="sm" /> <span>Loading Analytics...</span>
                            </div>
                        )}
                        {analyticsError && (
                            <p className="text-red-600 text-center p-4">
                                Error loading analytics: {analyticsError}
                            </p>
                        )}
                        {/* Only render charts if data is loaded and no error */}
                        {currentLinkAnalytics && !loadingAnalytics && !analyticsError && (
                            <AnalyticsCharts analyticsData={currentLinkAnalytics} />
                        )}
                    </td>
                </tr>
            )}

            {/* Modals */}
            {/* QR Code Modal Instance */}
            <QrCodeModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                url={link.shortUrl}
                originalUrl={link.originalUrl}
            />

            {/* Edit Link Modal Instance */}
            <EditLinkModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                link={link} // Pass the link data to the edit modal
            />

            {/* Confirm Delete Modal Instance */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)} // Allow closing if not loading
                onConfirm={handleDeleteConfirm} // Call the delete handler
                itemName={`link for "${link.originalUrl.substring(0, 30)}..."`} // Descriptive item name
                isLoading={loadingDelete} // Pass loading state
            />
        </>
    );
};

export default LinkTableRow;