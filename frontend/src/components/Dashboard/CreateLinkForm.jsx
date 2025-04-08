import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLink, fetchLinks, clearCreateError } from '../../features/links/linksSlice';
import Input from '../Common/Input';
import Button from '../Common/Button';

const CreateLinkForm = ({onLinkCreated}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const { loadingCreate, createError } = useSelector((state) => state.links);
  const { currentPage } = useSelector((state) => state.links.pagination); // Get current page

  useEffect(() => {
     // Clear form-level error when Redux error changes
     setFormError(createError || '');
     // Cleanup Redux error on unmount or when dependencies change
      return () => {
          dispatch(clearCreateError());
      };
  }, [createError, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous form errors
    dispatch(clearCreateError()); // Clear redux error

    if (!originalUrl) {
      setFormError('Original URL is required.');
      return;
    }

    // Basic URL validation (client-side)
    try {
        new URL(originalUrl);
    } catch (_) {
        setFormError('Please enter a valid URL (e.g., https://example.com).');
        return;
    }

    const linkData = {
      originalUrl,
      customAlias: customAlias.trim() || undefined, // Send undefined if empty
      expiresAt: expiresAt || undefined, // Send undefined if empty
    };

    dispatch(createLink(linkData)).then((action) => {
         if (createLink.fulfilled.match(action)) {
            // Clear form on success
            setOriginalUrl('');
            setCustomAlias('');
            setExpiresAt('');
            setFormError('');
            // Refetch links for the current page to show the new link
             dispatch(fetchLinks({ page: currentPage }));
             if (onLinkCreated) onLinkCreated(action.payload); // Optional callback
        }
        // Error is handled by the useEffect watching createError
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow space-y-4 mb-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Short Link</h3>
      {formError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{formError}</p>}
      <Input
        label="Original URL"
        id="originalUrl"
        name="originalUrl"
        type="url" // Use type="url" for better browser validation/keyboard
        placeholder="https://your-long-url.com/goes-here"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        required
        disabled={loadingCreate}
      />
      <Input
        label="Custom Alias (Optional)"
        id="customAlias"
        name="customAlias"
        type="text"
        placeholder="my-custom-link"
        value={customAlias}
        onChange={(e) => setCustomAlias(e.target.value)}
        disabled={loadingCreate}
        />
        <p className="text-xs text-gray-500">Leave blank for a random code. Use only letters, numbers, underscores, hyphens.</p>
      <Input
        label="Expiration Date (Optional)"
        id="expiresAt"
        name="expiresAt"
        type="datetime-local" // Use datetime-local for date and time picker
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        disabled={loadingCreate}
         min={new Date().toISOString().slice(0, 16)} // Prevent selecting past dates
      />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={loadingCreate} disabled={loadingCreate}>
          {loadingCreate ? 'Creating...' : 'Create Link'}
        </Button>
      </div>
    </form>
  );
};

export default CreateLinkForm;