import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../Common/Modal'; // Assuming Modal component exists
import Button from '../Common/Button';

const QrCodeModal = ({ isOpen, onClose, url, originalUrl }) => {

  const downloadQRCode = () => {
      const canvas = document.getElementById('qr-code-canvas');
      if (canvas) {
          const pngUrl = canvas
              .toDataURL('image/png')
              .replace('image/png', 'image/octet-stream'); // Prompt download
          let downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          // Generate filename from URL path segment
          const urlParts = url.split('/');
          const filename = urlParts[urlParts.length - 1] || 'qrcode';
          downloadLink.download = `${filename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Short Link QR Code">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-gray-600 text-center">Scan this code or share the link:</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline font-medium break-all"
        >
          {url}
        </a>
         <p className="text-xs text-gray-500 text-center mt-1">Original: <span className="break-all">{originalUrl}</span></p>
        <div className="p-2 bg-white border rounded">
          <QRCodeSVG
            id="qr-code-canvas" // ID for canvas access
            value={url}
            size={200} // Adjust size as needed
            level={'H'} // Error correction level
            includeMargin={true}
          />
        </div>
        <Button onClick={downloadQRCode} variant="secondary" size="sm">
             Download QR Code
        </Button>
      </div>
    </Modal>
  );
};

export default QrCodeModal;