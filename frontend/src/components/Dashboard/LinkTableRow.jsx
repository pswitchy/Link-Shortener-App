import React, { useState } from 'react';
// import QRCode from 'qrcode.react';
import { formatReadableDate, formatShortDate } from '../../utils/formatDate';
import Button from '../Common/Button';
import QrCodeModal from './QRCodeModal'; // Import the modal component
import AnalyticsCharts from './AnalyticsCharts'; // Import Analytics component
import { useDispatch, useSelector } from 'react-redux';
import { fetchLinkAnalytics, clearAnalytics } from '../../features/links/linksSlice';
import Spinner from '../Common/Spinner';

const LinkTableRow = ({ link }) => {
    const [showQrModal, setShowQrModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const dispatch = useDispatch();
    const { currentLinkAnalytics, loadingAnalytics, analyticsError } = useSelector(state => state.links);

    const handleShowAnalytics = () => {
        if (showAnalytics) {
             setShowAnalytics(false);
             dispatch(clearAnalytics()); // Clear analytics data when hiding
        } else {
            dispatch(fetchLinkAnalytics(link._id));
            setShowAnalytics(true);
        }
    };

    const expirationStatus = link.expiresAt
        ? (new Date(link.expiresAt) < new Date() ? 'Expired' : `Expires ${formatShortDate(link.expiresAt)}`)
        : 'Never';

    const expirationClass = link.expiresAt && new Date(link.expiresAt) < new Date()
        ? 'text-red-600 font-medium'
        : 'text-gray-500';


    return (
        <>
            <tr className="bg-white hover:bg-gray-50 border-b">
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline truncate block" title={link.originalUrl}>
                        {link.originalUrl}
                    </a>
                </td>
                <td className="px-4 py-3 text-sm">
                     <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium block" title={`Short URL: ${link.shortUrl}`}>
                        {/* Display just the path part for brevity */}
                        /{link.shortCode}
                     </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{link.totalClicks ?? 0}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatShortDate(link.createdAt)}</td>
                <td className={`px-4 py-3 text-sm ${expirationClass}`}>{expirationStatus}</td>
                <td className="px-4 py-3 text-sm text-gray-700 space-x-2 whitespace-nowrap">
                    <Button size="sm" variant="secondary" onClick={() => setShowQrModal(true)}>
                        QR
                    </Button>
                     <Button size="sm" variant="secondary" onClick={handleShowAnalytics}>
                         {showAnalytics ? 'Hide Stats' : 'Stats'}
                     </Button>
                    {/* Add Edit/Delete buttons later if needed */}
                </td>
            </tr>
            {/* Analytics Row (conditionally rendered) */}
            {showAnalytics && (
                <tr className="bg-gray-50">
                    <td colSpan="6" className="px-4 py-4">
                         {loadingAnalytics && <div className="flex justify-center items-center p-4"><Spinner /> Loading Analytics...</div>}
                         {analyticsError && <p className="text-red-600 text-center p-4">Error loading analytics: {analyticsError}</p>}
                         {currentLinkAnalytics && !loadingAnalytics && (
                             <AnalyticsCharts analyticsData={currentLinkAnalytics} />
                         )}
                    </td>
                </tr>
            )}

            {/* QR Code Modal */}
            <QrCodeModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                url={link.shortUrl}
                originalUrl={link.originalUrl}
            />
        </>
    );
};

export default LinkTableRow;