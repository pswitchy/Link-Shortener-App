import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName = 'item', isLoading = false }) => {
    // Prevent closing modal by clicking overlay if loading
    const handleClose = isLoading ? () => {} : onClose;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Confirm Deletion`}>
            <div className="space-y-4">
                <p className="text-sm text-gray-700">
                    Are you sure you want to delete this {itemName}? This action cannot be undone.
                </p>
                <div className="flex justify-end pt-4 space-x-2">
                    <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;