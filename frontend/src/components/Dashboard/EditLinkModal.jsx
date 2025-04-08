import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLink, clearUpdateError, fetchLinks } from '../../features/links/linksSlice';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { format } from 'date-fns'; // For formatting date for input

const EditLinkModal = ({ isOpen, onClose, link }) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [formError, setFormError] = useState('');

    const dispatch = useDispatch();
    const { loadingUpdate, updateError } = useSelector((state) => state.links);
    const { currentPage, totalLinks } = useSelector((state) => state.links.pagination);

    // Pre-fill form when modal opens or link changes
    useEffect(() => {
        if (link) {
            setOriginalUrl(link.originalUrl);
            // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
            setExpiresAt(link.expiresAt ? format(new Date(link.expiresAt), "yyyy-MM-dd'T'HH:mm") : '');
            setFormError(''); // Clear errors when link changes
             dispatch(clearUpdateError()); // Clear redux error
        }
    }, [link, isOpen, dispatch]); // Rerun if modal opens

    // Update form error display when Redux error changes
    useEffect(() => {
         setFormError(updateError || '');
    }, [updateError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        dispatch(clearUpdateError());

        if (!originalUrl) {
            setFormError('Original URL is required.');
            return;
        }
        try { new URL(originalUrl); } catch (_) {
            setFormError('Invalid Original URL format.'); return;
        }

        if (!link?._id) {
             setFormError('Link ID is missing.'); return;
        }

        const linkData = { originalUrl, expiresAt };

        dispatch(updateLink({ linkId: link._id, linkData }))
            .then(action => {
                if (updateLink.fulfilled.match(action)) {
                    onClose(); // Close modal on success
                    // Optionally trigger a refetch if state update isn't sufficient
                     // dispatch(fetchLinks({ page: currentPage }));
                }
                // Error is handled by the useEffect watching updateError
            });
    };

    // Prevent closing modal by clicking overlay if loading
    const handleClose = loadingUpdate ? () => {} : onClose;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Edit Link">
            <form onSubmit={handleSubmit} className="space-y-4">
                 {formError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{formError}</p>}
                 {/* Display short link for reference - non-editable */}
                 <div className="mb-2">
                     <label className="block text-sm font-medium text-gray-700">Short Link</label>
                     <p className="mt-1 text-sm text-gray-900 bg-gray-100 p-2 rounded border border-gray-300">
                         {link?.shortUrl || 'N/A'}
                     </p>
                 </div>

                 <Input
                    label="Original URL"
                    id="editOriginalUrl"
                    name="originalUrl"
                    type="url"
                    placeholder="https://your-long-url.com/goes-here"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                    disabled={loadingUpdate}
                 />
                 <Input
                    label="Expiration Date (Optional)"
                    id="editExpiresAt"
                    name="expiresAt"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    disabled={loadingUpdate}
                    min={new Date().toISOString().slice(0, 16)}
                 />
                 <div className="flex justify-end pt-4 space-x-2">
                     <Button type="button" variant="secondary" onClick={handleClose} disabled={loadingUpdate}>
                         Cancel
                     </Button>
                     <Button type="submit" variant="primary" isLoading={loadingUpdate} disabled={loadingUpdate}>
                        {loadingUpdate ? 'Saving...' : 'Save Changes'}
                     </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditLinkModal;